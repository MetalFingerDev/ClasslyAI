<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<div>
		<a href="/">Home</a>
		<a href="/about">About</a>
	</div>

	<a href="/profile" class="profile-btn" aria-label="Profile"></a>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		justify-content: space-between; /* Pushes links to left, profile to right */
		align-items: center;
	}

	div {
		display: flex;
		gap: 1rem; /* Space between links */
	}

	/* Rectangle styling for links */
	div a {
		text-decoration: none;
		color: black;
		padding: 0.5rem 1rem;
		display: inline-block;
	}

	div a:hover {
		background-color: #d0d0d0;
	}

	/* Circle styling for profile button */
	.profile-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #555;
		display: inline-block;
	}

	.profile-btn:hover {
		background-color: #333;
	}
</style>
