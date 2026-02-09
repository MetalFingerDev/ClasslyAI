<script lang="ts">
	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
	}

	interface Props {
		columns: Column[];
		data: any[];
		striped?: boolean;
		hoverable?: boolean;
	}

	let { columns, data, striped = true, hoverable = true }: Props = $props();

	let sortKey = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	let sortedData = $derived.by(() => {
		if (!sortKey) return data;
		const key = sortKey;

		return [...data].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];

			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	});

	function handleSort(key: string, sortable: boolean = true) {
		if (!sortable) return;

		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}
</script>

<div class="table-container">
	<table class:striped class:hoverable>
		<thead>
			<tr>
				{#each columns as column (column.key)}
					<th
						class:sortable={column.sortable !== false}
						class:sorted={sortKey === column.key}
						onclick={() => handleSort(column.key, column.sortable !== false)}
					>
						{column.label}
						{#if column.sortable !== false && sortKey === column.key}
							<span class="sort-indicator">
								{sortDirection === 'asc' ? '↑' : '↓'}
							</span>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedData as row, i (i)}
				<tr>
					{#each columns as column (column.key)}
						<td>{row[column.key]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: var(--surface-1, white);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	thead {
		background: var(--surface-2, #f8f9fa);
		border-bottom: 2px solid var(--border-color, #dee2e6);
	}

	th {
		padding: 12px 16px;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary, #212529);
		white-space: nowrap;
		user-select: none;
	}

	th.sortable {
		cursor: pointer;
		transition: background-color 0.2s;
	}

	th.sortable:hover {
		background: var(--surface-3, #e9ecef);
	}

	th.sorted {
		color: var(--primary-color, rebeccapurple);
	}

	.sort-indicator {
		margin-left: 4px;
		font-size: 0.9em;
	}

	td {
		padding: 12px 16px;
		color: var(--text-secondary, #495057);
		border-bottom: 1px solid var(--border-color, #dee2e6);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	/* Striped rows */
	table.striped tbody tr:nth-child(even) {
		background: var(--surface-2, #f8f9fa);
	}

	/* Hoverable rows */
	table.hoverable tbody tr {
		transition: background-color 0.2s;
	}

	table.hoverable tbody tr:hover {
		background: var(--surface-3, #e9ecef);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		th,
		td {
			padding: 8px 12px;
			font-size: 0.9em;
		}
	}
</style>
