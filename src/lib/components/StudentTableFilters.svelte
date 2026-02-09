<script lang="ts">
	import Icon from './Icon.svelte';
	import MenuBar from './MenuBar.svelte';

	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		width?: string;
	}

	let {
		statusFilter = $bindable('all'),
		courseFilter = $bindable('all'),
		searchQuery = $bindable(''),
		courses = [],
		columns = [],
		hiddenColumns = new Set<string>(),
		columnsOpen = $bindable(false),
		toggleColumn
	}: {
		statusFilter?: string;
		courseFilter?: string;
		searchQuery?: string;
		courses?: string[];
		columns?: Column[];
		hiddenColumns?: Set<string>;
		columnsOpen?: boolean;
		toggleColumn?: (key: string) => void;
	} = $props();

	const CHEVRON = 'M6 9l6 6 6-6';
	const PLUS = 'M12 5v14M5 12h14';
</script>

<MenuBar ariaLabelledby="filters-legend" className="toolbar">
	{#snippet legend()}
		<span>Student table filters</span>
	{/snippet}

	{#snippet content()}
		<label class="filter-group">
			<select class="select" bind:value={statusFilter}>
				<option value="all">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
			<select class="select" bind:value={courseFilter}>
				<option value="all">All Courses</option>
				{#each courses as course (course)}
					<option value={course}>{course}</option>
				{/each}
			</select>
		</label>

		<search class="search-field">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
			</svg>
			<input
				class="input"
				type="search"
				placeholder="Search students..."
				bind:value={searchQuery}
			/>
		</search>
	{/snippet}

	{#snippet actions()}
		<details class="dropdown" bind:open={columnsOpen}>
			<summary
				class="btn btn-ghost"
				onclick={(e) => {
					e.preventDefault();
					columnsOpen = !columnsOpen;
				}}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect x="3" y="3" width="7" height="18" rx="1" />
					<rect x="14" y="3" width="7" height="18" rx="1" />
				</svg>
				Columns
				<Icon path={CHEVRON} size={10} />
			</summary>
			<div class="dropdown-panel">
				{#each columns as col (col.key)}
					<label>
						<input
							type="checkbox"
							checked={!hiddenColumns.has(col.key)}
							onchange={() => toggleColumn?.(col.key)}
						/>
						{col.label}
					</label>
				{/each}
			</div>
		</details>
		<button class="icon-btn" aria-label="Add student">
			<Icon path={PLUS} size={16} />
		</button>
	{/snippet}
</MenuBar>

<style>
	/* Toolbar */
	:global(.menubar.toolbar) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
	}

	@media (max-width: 640px) {
		:global(.menubar.toolbar) {
			flex-wrap: wrap;
		}
	}

	/* Filter group */
	.filter-group {
		display: contents;
	}

	/* Search field */
	search.search-field {
		position: relative;
		flex: 1;
		max-width: 280px;
	}

	search.search-field svg {
		position: absolute;
		left: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	search.search-field .input {
		padding-left: 2rem;
		font-size: 0.8rem;
	}

	@media (max-width: 640px) {
		search.search-field {
			order: 3;
			max-width: 100%;
			flex-basis: 100%;
		}
	}

	/* Dropdown styles now live in `app.css` to keep them consistent across components.
	   Keep only small, component-specific styles here (if needed). */
</style>
