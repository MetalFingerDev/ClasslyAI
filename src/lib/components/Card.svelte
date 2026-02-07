<script lang="ts">
	export let title = 'Card Title';
	export let description = 'This is a description of the card content.';
</script>

<div id="card">
	<article>
		<h2>{title}</h2>
		<p>{description}</p>
	</article>
</div>

<style>
	#card {
		/* Layered backgrounds: inner background on padding-box, gradient on border-box */
		background:
			linear-gradient(var(--card-bg, var(--bg-card)), var(--card-bg, var(--bg-card))) padding-box,
			var(--border-card) border-box;
		color: var(--card-foreground, var(--text));
		padding: 1rem;
		border: var(--card-border-width, 1px) solid transparent;
		border-radius: var(--radius);
		box-shadow: var(--card-shadow, var(--shadow));

		width: 200px;
		height: minmax(100px, auto);

		/* Smooth, subtle scale on hover */
		transform-origin: center;
		transition:
			transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1),
			box-shadow 180ms ease,
			background 180ms ease;
		will-change: transform;
	}

	#card:hover {
		transform: scale(1.03);
		/* switch to the hover gradient variant */
		background:
			linear-gradient(var(--card-bg, var(--bg-card)), var(--card-bg, var(--bg-card))) padding-box,
			var(--border-card-hover) border-box;
		box-shadow: var(--card-shadow-hover, var(--shadow));
	}

	article {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
