import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.0-flash';
const MIN_INTERVAL_MS = 10_000; // 10 seconds between ANY Gemini call

// ── Singleton client (survives HMR via globalThis) ──────────────────
const KEY = '__gemini_state__' as const;

interface GeminiState {
	client: GoogleGenerativeAI | null;
	lastCallTime: number;
	callCount: number;
	inFlight: boolean;
}

function getState(): GeminiState {
	const g = globalThis as unknown as Record<string, GeminiState>;
	g[KEY] ??= { client: null, lastCallTime: 0, callCount: 0, inFlight: false };
	return g[KEY];
}

function getClient(): GoogleGenerativeAI {
	const state = getState();
	if (!state.client) {
		const key = env.GEMINI_API_KEY;
		if (!key || key === 'your_key_here') {
			throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
		}
		state.client = new GoogleGenerativeAI(key);
	}
	return state.client;
}

/**
 * Central gate — every Gemini call MUST go through here.
 * Prevents concurrent calls, enforces cooldown, logs every call.
 */
async function callGemini(prompt: string): Promise<string> {
	const state = getState();

	// Block concurrent / duplicate calls
	if (state.inFlight) {
		throw new Error('[Gemini] Blocked: a request is already in flight.');
	}

	// Cooldown between calls
	const elapsed = Date.now() - state.lastCallTime;
	if (elapsed < MIN_INTERVAL_MS) {
		const wait = Math.ceil((MIN_INTERVAL_MS - elapsed) / 1000);
		throw new Error(`[Gemini] Blocked: cooldown active. Wait ${wait}s.`);
	}

	state.inFlight = true;
	state.lastCallTime = Date.now();
	state.callCount += 1;
	const callNum = state.callCount;

	console.log(`[Gemini] Call #${callNum} — sending request…`);

	try {
		const client = getClient();
		const model = client.getGenerativeModel({ model: MODEL });
		const result = await model.generateContent(prompt);
		const text = result.response.text();
		console.log(`[Gemini] Call #${callNum} — success (${text.length} chars)`);
		return text;
	} catch (err) {
		console.error(`[Gemini] Call #${callNum} — FAILED:`, err);
		throw err;
	} finally {
		state.inFlight = false;
	}
}

/**
 * Send a prompt to Gemini and return the raw text response.
 */
export async function generateText(prompt: string): Promise<string> {
	return callGemini(prompt);
}

/**
 * Send a prompt to Gemini and parse the response as JSON.
 * Strips markdown fences if Gemini wraps the output in ```json … ```.
 */
export async function generateJSON<T = unknown>(prompt: string): Promise<T> {
	const text = await callGemini(prompt);
	const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
	return JSON.parse(cleaned) as T;
}
