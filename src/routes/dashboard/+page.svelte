<script lang="ts">
	import graph from '$lib/assets/image.png';
	import biki from '$lib/assets/biki.jpg';
	import owo from '$lib/assets/owo.jpg';
	import red from '$lib/assets/red.jpg';
	import tank from '$lib/assets/tank.jpg';
	import water from '$lib/assets/water.jpg';
	import jif from '$lib/assets/bwolfie.gif';
	import Table from '$lib/components/Table.svelte';

	// Sample data for the table
	const columns = [
		{ key: 'name', label: 'Student Name' },
		{ key: 'course', label: 'Course' },
		{ key: 'grade', label: 'Grade' },
		{ key: 'attendance', label: 'Attendance', sortable: true },
		{ key: 'status', label: 'Status' }
	];

	const tableData = [
		{
			name: 'Alice Johnson',
			course: 'Mathematics',
			grade: 'A',
			attendance: '95%',
			status: 'Active'
		},
		{ name: 'Bob Smith', course: 'Physics', grade: 'B+', attendance: '88%', status: 'Active' },
		{
			name: 'Charlie Brown',
			course: 'Chemistry',
			grade: 'A-',
			attendance: '92%',
			status: 'Active'
		},
		{ name: 'Diana Prince', course: 'Biology', grade: 'A+', attendance: '98%', status: 'Active' },
		{
			name: 'Ethan Hunt',
			course: 'Computer Science',
			grade: 'B',
			attendance: '85%',
			status: 'Active'
		},
		{ name: 'Fiona Green', course: 'English', grade: 'A', attendance: '90%', status: 'Active' },
		{ name: 'George Wilson', course: 'History', grade: 'B-', attendance: '80%', status: 'Inactive' }
	];
</script>

<!------ HTML ------>

<div>header for dashboard</div>
<div id="container">
	<div id="child"><img src={biki} alt="biki" /></div>
	<div id="child"><img src={owo} alt="owo" /></div>
	<div id="child"><img src={red} alt="red" /></div>
	<div id="child"><img src={tank} alt="tank" /></div>
	<div id="child"><img src={water} alt="water" /></div>
	<div id="child"><img src={jif} alt="jif" /></div>
	<div id="child">
		<iframe
			title="awsome songs from yt"
			src="https://www.youtube.com/embed/w5VFOKKAbQQ?list=RDw5VFOKKAbQQ"
			allow="autoplay; encrypted-media"
			allowfullscreen
		>
		</iframe>
	</div>
</div>
<div class="graph">
	<img src={graph} alt="Total Visitors graph" />
</div>
<div>menu</div>
<Table {columns} data={tableData} />
<div>footer</div>

<!------ /HTML ------>

<style>
	/* border and padding for debudding */
	div {
		border: rebeccapurple solid 1px;
		padding: var(--gap);
	}
	iframe {
		height: 100%;
		width: 100%;
	}
	#container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--gap);
	}
	#child {
		min-height: 200px;
		overflow: hidden;
	}
	#child img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Graph image styles */
	.graph {
		border: none;
		padding: 0;
	}
	.graph img {
		width: 100%;
		height: auto;
		display: block;
		border-radius: 8px;
		object-fit: contain;
	}
</style>
