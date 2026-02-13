<script lang="ts">
	import Fa, { type IconSize } from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	let {
		icon,
		size = 'sm',
		color = 'currentColor'
	}: {
		icon: IconDefinition;
		size?: IconSize | string;
		color?: string;
	} = $props();

	const VALID_SIZES = [
		'xs',
		'sm',
		'lg',
		'1x',
		'2x',
		'3x',
		'4x',
		'5x',
		'6x',
		'7x',
		'8x',
		'9x',
		'10x'
	];
	const validSize = $derived(VALID_SIZES.includes(size as string));
</script>

<span
	class="icon"
	style:width={!validSize ? size : 'auto'}
	style:height={!validSize ? size : 'auto'}
>
	<Fa {icon} size={validSize ? (size as IconSize) : undefined} {color} />
</span>

<style>
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: inherit;
	}
</style>
