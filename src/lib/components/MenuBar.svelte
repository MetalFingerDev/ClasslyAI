<script lang="ts">
	import type { Snippet } from 'svelte';


	let {
		className = '',
		role = 'toolbar',
		ariaLabel = undefined,
		ariaLabelledby = undefined,
		legend = undefined,
		content = undefined,
		actions = undefined
	}: {
		className?: string;
		role?: string;
		ariaLabel?: string;
		ariaLabelledby?: string;
		legend?: Snippet;
		content?: Snippet;
		actions?: Snippet;
	} = $props();
</script>

<form
	class={`menubar ${className} toolbar`}
	{role}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
>
	{#if legend}
		<div id={ariaLabelledby} class="menubar-legend">{@render legend()}</div>
	{/if}

	<div class="content">
		{#if content}{@render content()}{/if}
	</div>
	<div class="actions">
		{#if actions}{@render actions()}{/if}
	</div>
</form>

<style>
	.menubar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.menubar .content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.menubar .actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto; /* keep actions pinned to the far right */
	}

	.menubar-legend {
		/* Visually hidden by default; user can style via slot if desired */
		position: absolute !important;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 640px) {
		.menubar {
			flex-wrap: wrap;
		}
		.menubar .actions {
			order: 2;
			margin-left: 0;
		}
	}
</style>
