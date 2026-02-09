<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';

	let { form } = $props();

	let questions = $derived(form?.quizData ?? []);
	let results = $derived(form?.results ?? []);
	let score = $derived(form?.score ?? null);
	let submitted = $derived(form?.submitted ?? false);
	let error = $derived(form?.error ?? '');

	let selectedAnswers = $state<Record<number, string>>({});
	let activeTab = $state<'questions' | 'results'>('questions');

	// Reset selections when new questions arrive
	$effect(() => {
		if (questions.length > 0 && !submitted) {
			selectedAnswers = {};
			activeTab = 'questions';
		}
		if (submitted) {
			activeTab = 'results';
		}
	});
</script>

<!-------- HTML -------->

<section class="quiz-page">
	<h1>Quizzes</h1>

	<form method="POST" action="?/generate" use:enhance class="generate-form">
		<input
			name="topic"
			type="text"
			placeholder="e.g. Photosynthesis, World War II, Linear Algebra…"
			value={form?.topic ?? ''}
			required
		/>
		<button type="submit" class="btn btn-primary">Generate Quiz</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if questions.length > 0}
		<!-- Tabs -->
		<ul class="tabs">
			<li>
				<button
					class="tab"
					class:active={activeTab === 'questions'}
					onclick={() => (activeTab = 'questions')}
				>
					Questions
				</button>
			</li>
			<li>
				<button
					class="tab"
					class:active={activeTab === 'results'}
					disabled={!submitted}
					onclick={() => (activeTab = 'results')}
				>
					Results
				</button>
			</li>
		</ul>

		<!-- Questions tab -->
		{#if activeTab === 'questions'}
			<form method="POST" action="?/submit" use:enhance>
				<input type="hidden" name="questions" value={JSON.stringify(questions)} />
				<input type="hidden" name="answers" value={JSON.stringify(selectedAnswers)} />

				{#each questions as q, i (q.question)}
					<Card title="Question {i + 1}">
						{#snippet content()}
							<p class="question-text">{q.question}</p>
							<ul class="options">
								{#each q.options as option (option)}
									{@const letter = option.charAt(0)}
									<li>
										<label class="option-label" class:selected={selectedAnswers[i] === letter}>
											<input
												type="radio"
												name="q{i}"
												value={letter}
												checked={selectedAnswers[i] === letter}
												onchange={() => (selectedAnswers[i] = letter)}
											/>
											{option}
										</label>
									</li>
								{/each}
							</ul>
						{/snippet}
					</Card>
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

		<!-- Results tab -->
		{#if activeTab === 'results' && submitted && score}
			<div class="score-summary">
				<h2>{score.percentage}%</h2>
				<p>{score.correct} / {score.total} correct</p>
			</div>

			{#each results as r, i (r.questionIndex)}
				<Card title="Question {i + 1}">
					{#snippet content()}
						<p class="question-text">{r.question}</p>
						<p class="result-answer" class:correct={r.isCorrect} class:wrong={!r.isCorrect}>
							Your answer: {r.userAnswer || '(none)'} — {r.isCorrect
								? '✅ Correct'
								: `❌ Correct answer: ${r.correctAnswer}`}
						</p>
					{/snippet}
				</Card>
			{/each}
		{/if}
	{/if}
</section>

<!-------- /HTML -------->

<style>
	.quiz-page {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
	}

	.generate-form {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.generate-form input {
		flex: 1;
		padding: 0.6rem 1rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		font: inherit;
	}

	.error {
		color: #ef4444;
		margin-bottom: 1rem;
	}

	/* Tabs */
	.tabs {
		list-style: none;
		display: flex;
		gap: 0.5rem;
		padding: 0;
		margin-bottom: 1.5rem;
	}
	.tab {
		padding: 0.5rem 1.2rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font: inherit;
		font-weight: 600;
	}
	.tab.active {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}
	.tab:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Questions */
	.question-text {
		font-weight: 500;
		margin-bottom: 0.75rem;
	}
	.options {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.option-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		cursor: pointer;
		transition: background var(--transition-speed);
	}
	.option-label:hover {
		background: var(--surface);
	}
	.option-label.selected {
		border-color: var(--accent);
		background: var(--surface);
	}
	.option-label input[type='radio'] {
		accent-color: var(--accent);
	}

	.submit-btn {
		margin-top: 1.5rem;
		width: 100%;
		justify-content: center;
	}
	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Results */
	.score-summary {
		text-align: center;
		margin-bottom: 1.5rem;
	}
	.score-summary h2 {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--accent);
	}
	.score-summary p {
		color: var(--text-muted);
	}
	.result-answer {
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		font-weight: 500;
	}
	.result-answer.correct {
		background: rgba(34, 197, 94, 0.1);
		color: #16a34a;
	}
	.result-answer.wrong {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}
</style>
