<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		content,
		preset = 'default',
		accent
	}: {
		content?: Snippet;
		preset?: 'default' | 'notched' | 'flat';
		accent?: string;
	} = $props();
</script>

<article class="card" data-preset={preset} style:--accent={accent}>
	{@render content?.()}
</article>

<style>
	.card {
		padding: 1.5rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		transition: transform 0.2s;
	}

	.card[data-preset='notched'] {
		border-left: 4px solid var(--accent, var(--color-accent));
	}

	.card[data-preset='flat'] {
		box-shadow: none;
		background: transparent;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-card-hover);
	}
</style>
