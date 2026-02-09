<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Card from '$lib/components/Card.svelte';
	import Fa from 'svelte-fa';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import MenuDropdown from '$lib/components/MenuDropdown.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { faClipboardQuestion, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

	let { form } = $props();

	// UI state for history sorting and export
	const CHEVRON = 'M6 9l6 6 6-6';
	const PLUS = 'M12 5v14M5 12h14';
	const TRASH = 'M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4h4v2';
	let sortBy = $state<'date' | 'score' | 'topic'>('date');
	let sortDir = $state<'desc' | 'asc'>('desc');
	let sortOpen = $state(false);

	function sortLabel(key: string) {
		if (key === 'date') return 'Date';
		if (key === 'score') return 'Score';
		return 'Topic';
	}

	function exportHistory() {
		if (quizHistory.length === 0) return;
		const blob = new Blob([JSON.stringify(quizHistory, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'quiz-history.json';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	function clearHistory() {
		if (quizHistory.length === 0) return;
		const ok = confirm('Clear all quiz history? This cannot be undone.');
		if (!ok) return;
		quizHistory = [];
	}

	let questions = $derived(form?.quizData ?? []);
	let results = $derived(form?.results ?? []);
	let score = $derived(form?.score ?? null);
	let submitted = $derived(form?.submitted ?? false);
	let error = $derived(form?.error ?? '');

	let selectedAnswers = $state<Record<number, string>>({});
	let activeTab = $state<'questions' | 'results'>('questions');
	let loading = $state(false);

	// Mock quiz history (replace with real data later)
	interface HistoryEntry {
		topic: string;
		score: number;
		total: number;
		date: string;
	}

	let quizHistory = $state<HistoryEntry[]>([
		{ topic: 'Photosynthesis', score: 3, total: 3, date: '2 hours ago' },
		{ topic: 'World War II', score: 2, total: 3, date: '5 hours ago' },
		{ topic: 'Linear Algebra', score: 1, total: 3, date: 'Yesterday' },
		{ topic: 'Organic Chemistry', score: 3, total: 3, date: '2 days ago' },
		{ topic: 'Shakespeare', score: 2, total: 3, date: '3 days ago' }
	]);

	function scoreClass(s: number, total: number): string {
		const pct = (s / total) * 100;
		if (pct >= 80) return 'good';
		if (pct >= 50) return 'okay';
		return 'poor';
	}

	// Add to history on submit
	$effect(() => {
		if (submitted && score) {
			const topic = form?.topic ?? 'Unknown';
			untrack(() => {
				quizHistory = [
					{ topic, score: score!.correct, total: score!.total, date: 'Just now' },
					...quizHistory
				];
			});
		}
	});

	// Reset selections
	$effect(() => {
		const hasQuestions = questions.length > 0;
		const isSubmitted = submitted;

		untrack(() => {
			if (hasQuestions && !isSubmitted) {
				selectedAnswers = {};
				activeTab = 'questions';
			}
			if (isSubmitted) {
				activeTab = 'results';
			}
		});
	});

	const handleEnhance: SubmitFunction = ({ cancel }) => {
		if (loading) {
			cancel();
			return;
		}
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update({ reset: false, invalidateAll: false });
		};
	};
</script>

<!------ HTML ------>

{#snippet questionCard(q: { question: string; options: string[] }, i: number)}
	<Card title="Question {i + 1}">
		{#snippet content()}
			<p class="question-text">{q.question}</p>
			<fieldset class="fieldset-reset quiz-options">
				{#each q.options as option (option)}
					{@const letter = option.charAt(0)}
					<label class:selected={selectedAnswers[i] === letter}>
						<input
							type="radio"
							name="q{i}"
							value={letter}
							checked={selectedAnswers[i] === letter}
							onchange={() => (selectedAnswers[i] = letter)}
						/>
						{option}
					</label>
				{/each}
			</fieldset>
		{/snippet}
	</Card>
{/snippet}

{#snippet resultCard(
	r: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean },
	i: number
)}
	<Card title="Question {i + 1}">
		{#snippet content()}
			<p class="question-text">{r.question}</p>
			<p class="result-feedback" class:correct={r.isCorrect} class:wrong={!r.isCorrect}>
				Your answer: {r.userAnswer || '(none)'} — {r.isCorrect
					? '✅ Correct'
					: `❌ Correct answer: ${r.correctAnswer}`}
			</p>
		{/snippet}
	</Card>
{/snippet}

<!-- Hero -->
<header class="section section-center hero">
	<div class="hero-badge">
		<Fa icon={faClipboardQuestion} />
		<span>AI-Powered Quizzes</span>
	</div>
	<h1>Test your <em>knowledge.</em></h1>
	<p class="subtitle">
		Enter any topic and get instant AI-generated quiz questions. Track your scores and watch
		yourself improve.
	</p>
</header>

<section class="section">
	<form class="generate-form" method="POST" action="?/generate" use:enhance={handleEnhance}>
		<input
			class="input"
			name="topic"
			type="text"
			placeholder="e.g. Photosynthesis, World War II, Linear Algebra…"
			value={form?.topic ?? ''}
			required
			disabled={loading}
		/>
		<button type="submit" class="btn btn-primary" disabled={loading}>
			{loading ? 'Generating…' : 'Generate Quiz'}
			{#if !loading}<Fa icon={faArrowRight} />{/if}
		</button>
	</form>

	{#if error}
		<p class="alert-error" role="alert">{error}</p>
	{/if}
</section>

{#if questions.length > 0}
	<section class="section">
		<nav class="tab-bar">
			<menu class="tab-list">
				<li>
					<button
						class:active={activeTab === 'questions'}
						onclick={() => (activeTab = 'questions')}
					>
						Questions
					</button>
				</li>
				<li>
					<button
						class:active={activeTab === 'results'}
						disabled={!submitted}
						onclick={() => (activeTab = 'results')}
					>
						Results
					</button>
				</li>
			</menu>
		</nav>

		{#if activeTab === 'questions'}
			<form class="quiz-form" method="POST" action="?/submit" use:enhance={handleEnhance}>
				<input type="hidden" name="questions" value={JSON.stringify(questions)} />
				<input type="hidden" name="answers" value={JSON.stringify(selectedAnswers)} />

				{#each questions as q, i (q.question)}
					{@render questionCard(q, i)}
				{/each}

				<button
					type="submit"
					class="btn btn-primary submit-btn"
					disabled={Object.keys(selectedAnswers).length < questions.length}
				>
					Submit Answers
				</button>
			</form>
		{/if}

		{#if activeTab === 'results' && submitted && score}
			<output class="score-display">
				<h2>{score.percentage}%</h2>
				<p class="text-muted">{score.correct} / {score.total} correct</p>
			</output>

			{#each results as r, i (r.questionIndex)}
				{@render resultCard(r, i)}
			{/each}
		{/if}
	</section>
{/if}

<section class="section">
	<MenuBar ariaLabelledby="history-legend" className="toolbar">
		{#snippet legend()}
			<span>Quiz history</span>
		{/snippet}

		{#snippet content()}
			<div>
				<span class="icon-accent"><Fa icon={faClock} /></span>
				<strong>History</strong>
				<span class="text-muted history-count">{quizHistory.length} quizzes</span>
			</div>
		{/snippet}

		{#snippet actions()}
			<MenuDropdown bind:open={sortOpen} ariaLabel="Sort options">
				{#snippet summary()}
					Sort: {sortLabel(sortBy)} <Icon path={CHEVRON} size={10} />
				{/snippet}

				{#snippet content(handleItemClick)}
					<button
						class="dropdown-item"
						onclick={() => {
							sortBy = 'date';
							sortOpen = false;
						}}>Date</button
					>
					<button
						class="dropdown-item"
						onclick={() => {
							sortBy = 'score';
							sortOpen = false;
						}}>Score</button
					>
					<button
						class="dropdown-item"
						onclick={() => {
							sortBy = 'topic';
							sortOpen = false;
						}}>Topic</button
					>
					<hr />
					<button
						class="dropdown-item"
						onclick={() => {
							sortDir = sortDir === 'asc' ? 'desc' : 'asc';
						}}>Direction: {sortDir}</button
					>
				{/snippet}
			</MenuDropdown>

			<button
				class="icon-btn danger"
				onclick={clearHistory}
				aria-label="Clear history"
				title="Clear history"
				disabled={quizHistory.length === 0}
			>
				<Icon path={TRASH} size={14} />
			</button>

			<button
				class="icon-btn"
				aria-label="Export history"
				onclick={exportHistory}
				disabled={quizHistory.length === 0}
				title="Export history"
			>
				<Icon path={PLUS} size={14} />
			</button>
		{/snippet}
	</MenuBar>

	<div class="data-card">
		{#if quizHistory.length > 0}
			<ul class="history-list">
				{#each quizHistory as entry (entry.topic + entry.date)}
					<li class="history-item">
						<span class="score-pill {scoreClass(entry.score, entry.total)}">
							{Math.round((entry.score / entry.total) * 100)}%
						</span>
						<div class="history-meta">
							<strong>{entry.topic}</strong>
							<span>{entry.score}/{entry.total} correct · {entry.date}</span>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty-state">No quizzes taken yet. Generate one above to get started!</p>
		{/if}
	</div>
</section>

<!------ /HTML ------>

<style>
	/* Generate form layout */
	.generate-form {
		display: flex;
		gap: 0.75rem;
	}

	.generate-form .input {
		flex: 1;
	}

	/* Tab bar */
	.tab-bar {
		margin-bottom: 1.5rem;
	}

	.tab-list {
		list-style: none;
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: var(--surface);
		border-radius: 10px;
		border: 1px solid var(--border);
	}

	.tab-list button {
		padding: 0.45rem 1rem;
		border-radius: 7px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		transition:
			background var(--transition-speed),
			color var(--transition-speed),
			box-shadow var(--transition-speed);
	}

	.tab-list button:hover:not(:disabled) {
		color: var(--text);
	}

	.tab-list button.active {
		background: var(--card-bg);
		color: var(--text);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.tab-list button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Quiz form spacing */
	.quiz-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Question text */
	.question-text {
		font-weight: 500;
		margin-bottom: 0.75rem;
	}

	/* Quiz options */
	.quiz-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.quiz-options label {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 0.85rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		cursor: pointer;
		font-size: 0.875rem;
		transition:
			background var(--transition-speed),
			border-color var(--transition-speed);
	}

	.quiz-options label:hover {
		background: var(--surface);
	}

	.quiz-options label.selected {
		border-color: var(--accent);
		background: var(--surface);
	}

	.quiz-options input[type='radio'] {
		accent-color: var(--accent);
	}

	/* Result feedback */
	.result-feedback {
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		font-weight: 500;
	}

	.result-feedback.correct {
		background: var(--success-bg);
		color: var(--success-text);
	}

	.result-feedback.wrong {
		background: var(--danger-bg);
		color: var(--danger-text);
	}

	/* Score display */
	.score-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.score-display h2 {
		font-size: 2.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--icon-primary), var(--accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Submit full width */
	.submit-btn {
		width: 100%;
		justify-content: center;
	}

	/* History card header */
	.history-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		font-size: 0.875rem;
	}

	.history-count {
		margin-left: 0.5rem;
		font-size: 0.75rem;
	}

	/* History list */
	.history-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.history-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		transition: background var(--transition-speed);
	}

	.history-item:last-child {
		border-bottom: none;
	}

	.history-item:hover {
		background: var(--surface);
	}

	.score-pill {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.score-pill.good {
		background: var(--success-bg);
		color: var(--success-text);
	}

	.score-pill.okay {
		background: rgba(234, 179, 8, 0.1);
		color: #a16207;
	}

	.score-pill.poor {
		background: var(--danger-bg);
		color: var(--danger-text);
	}

	.history-meta {
		flex: 1;
		min-width: 0;
	}

	.history-meta strong {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.history-meta span {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	/* Dropdown styles moved into `MenuDropdown.svelte` */

	.generate-form {
		flex-direction: column;
	}
</style>
