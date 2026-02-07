<script>
	import Card from '$lib/components/Card.svelte';
</script>

<section>
	<Card title="TO-DO" description="check out hwat you have left to do" />

	<Card title="Announcements" description="Latest class news and updates" />
	<Card title="Grades" description="View your recent grades and feedback" />
	<Card title="Calendar" description="Upcoming due dates and events" />
	<Card title="Resources" description="Course materials and helpful links" />
	<Card title="Messages" description="Communicate with instructors and classmates" />
	<Card title="Schedule" description="Your weekly timetable and office hours" />
</section>

<style>
	section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}
</style>
