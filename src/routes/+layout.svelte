<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	let page = $state('home');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-grid">
	<aside>
		<nav aria-label="Main">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/dashboard">Dashboard</a></li>
				<li><a href="/library">Library</a></li>
				<li><a href="/assignments">Assignments</a></li>
				<li><a href="/quizzes">Quizzes</a></li>
			</ul>
		</nav>
		<footer>
			<button>Settings</button>
		</footer>
	</aside>

	<section>
		<header>
			<button class="menu" aria-label="Open menu">☰</button>
			<span class="header-title">{page}</span>

			<a href="/profile" class="profile" aria-label="Profile"></a>
		</header>

		<main>{@render children()}</main>
	</section>
</div>

<style>
	:global(.app-container) {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--text);
	}

	.app-grid {
		display: grid;
		grid-template-columns: var(--aside-width) 1fr;
		gap: var(--gap);
		align-items: start;
		min-height: 100vh;
	}

	aside {
		background: var(--bg-aside);
		padding: 1rem;
		border-right: 1px solid var(--border);
		box-sizing: border-box;
		height: 100vh;
		position: sticky;
		top: 0;
		align-self: start;
	}

	aside nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	aside ul li {
		margin-bottom: 10px;
		font-size: 16px;
	}

	aside ul li a {
		text-decoration: none;
		color: inherit;
		display: block;
		padding: 10px;
		border-radius: var(--radius);
	}

	aside ul li a:hover,
	aside ul li a:focus {
		background: var(--bg-active);
		color: var(--text);
	}

	section {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: var(--bg-header);
		border-bottom: 1px solid var(--border);
		box-sizing: border-box;
	}

	header .profile {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--bg-profile);
	}

	header span{
		font-size: 1.25rem;
		font-weight: 500;
	}
	
	header button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}
	/* Main content */
	main {
		padding: 1.5rem;
		background: var(--bg);
		min-height: 0;
		box-sizing: border-box;
		flex: 1 1 auto;
		overflow: auto;
	
	}
</style>
