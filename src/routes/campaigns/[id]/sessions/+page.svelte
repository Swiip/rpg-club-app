<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import NewSessionsTable from '$lib/components/forms/new-sessions-table.svelte';
	import SessionsTable from '$lib/components/forms/sessions-table.svelte';

	let { data } = $props();
	let { campaign, events } = $derived(data);
</script>

<Container>
	<h2 class="h2 pt-8 pb-4 text-center capitalize">
		Nouvelle session<br />
		{campaign.title}
	</h2>

	<h2 class="h3 pt-8 pb-4 text-center capitalize">Sessions existantes</h2>

	<SessionsTable campaignId={campaign.id} sessions={campaign.session} showPlusButton={false} />

	<h2 class="h3 pt-8 pb-4 text-center capitalize">Dates possibles</h2>

	<NewSessionsTable {campaign} {events} />
</Container>
