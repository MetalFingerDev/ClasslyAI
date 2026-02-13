<script lang="ts">
	let { initialTodos = [] }: { initialTodos?: string[] } = $props();

	// State
	let todos = $derived(initialTodos.map((t, i) => ({ id: i, text: t, done: false })));
	let inputValue = $state('');

	// Derived
	let remaining = $derived(todos.filter((t) => !t.done).length);

	function addTodo(e: SubmitEvent) {
		e.preventDefault();
		const text = inputValue.trim();
		if (!text) return;

		todos.push({ id: Date.now(), text, done: false });
		inputValue = '';
	}

	function removeTodo(id: number) {
		const index = todos.findIndex((t) => t.id === id);
		if (index !== -1) todos.splice(index, 1);
	}
</script>

<div class="todo-widget">
	<div class="header">
		<h3>Tasks</h3>
		<span class="badge">{remaining} pending</span>
	</div>

	<form onsubmit={addTodo} class="input-group">
		<input type="text" bind:value={inputValue} placeholder="Add a new task..." />
		<button type="submit" disabled={!inputValue.trim()}>+</button>
	</form>

	<ul class="list">
		{#each todos as todo (todo.id)}
			<li class:done={todo.done}>
				<label>
					<input type="checkbox" bind:checked={todo.done} />
					<span>{todo.text}</span>
				</label>
				<button class="delete-btn" onclick={() => removeTodo(todo.id)} aria-label="Delete">×</button
				>
			</li>
		{/each}
		{#if todos.length === 0}
			<li class="empty">All caught up!</li>
		{/if}
	</ul>
</div>

<style>
	.todo-widget {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header h3 {
		margin: 0;
		font-size: 1.1rem;
	}
	.badge {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		background: var(--color-surface-soft);
		padding: 2px 8px;
		border-radius: 99px;
	}

	.input-group {
		display: flex;
		gap: 0.5rem;
	}

	input[type='text'] {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		background: var(--color-surface);
		color: var(--color-text);
	}

	button[type='submit'] {
		background: var(--color-accent);
		color: white;
		border: none;
		width: 2rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	li.done {
		opacity: 0.6;
		text-decoration: line-through;
	}

	li label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
		flex: 1;
	}

	.delete-btn {
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0 0.5rem;
	}
	.delete-btn:hover {
		color: #ef4444;
	}

	.empty {
		justify-content: center;
		border: none;
		color: var(--color-text-muted);
		font-style: italic;
	}
</style>
