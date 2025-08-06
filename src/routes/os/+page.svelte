<script lang="ts">
	import { goto } from '$app/navigation';
	import OsCard from '$lib/components/os-card.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';

	let { data } = $props();
	let { members, oses, supabase } = $derived(data);

	const registrations = $derived(computeRegistrations(oses));
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/os/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#if oses && oses.length > 0}
		{#each oses as os (os.id)}
			<OsCard {members} {os} registration={registrations[os.id]} {supabase} />
		{/each}
	{/if}
</div>
