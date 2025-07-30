<script lang="ts">
	import { goto } from '$app/navigation';
	import OsCard from '$lib/components/os-card.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';

	const { data } = $props();
	const { member, oses, supabase } = data;

	const handleClick = () => {
		goto(`/os/new/edit`);
	};

	const registrations = $derived(computeRegistrations(oses, member));
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/os/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#if oses && oses.length > 0}
		{#each oses as os (os.id)}
			<OsCard {member} {os} registration={registrations[os.id]} {supabase} />
		{/each}
	{/if}
</div>
