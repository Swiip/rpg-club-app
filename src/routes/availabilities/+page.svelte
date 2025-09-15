<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import AvailabilitiesTable from '$lib/components/forms/availabilities-table.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import { gotoWithParam } from '$lib/logic/urls.js';

	let { data } = $props();
	let { events, memberId, member, members } = $derived(data);

	const handleChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		return gotoWithParam('member', target.value === String(member.id) ? undefined : target.value);
	};
</script>

<Container>
	<FuturePastTabs />

	<div class="flex w-full flex-col gap-2">
		En tant que :
		<select class="select" value={memberId} onchange={handleChange}>
			{#if members && members.length > 0}
				{#each members as { id, handle } (id)}
					<option value={id}>{handle}</option>
				{/each}
			{/if}
		</select>
	</div>

	<AvailabilitiesTable {events} {memberId} />
</Container>
