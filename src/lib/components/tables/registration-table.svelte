<script lang="ts">
	import { computeRegistration, type RegistrionModel } from '$lib/logic/registrations';
	import type { WithRegistration } from '$lib/supabase/types';
	import Avatars from '../avatars.svelte';
	import MemberTableRow from '../table/member-table-row.svelte';
	import MemberTable from '../table/member-table.svelte';

	type Props = {
		withRegistration: WithRegistration;
		roleLabel?: string;
	};

	let { withRegistration, roleLabel = 'PJs' }: Props = $props();
	let registration: RegistrionModel = $derived(computeRegistration(withRegistration));
	let { hasConfirmed, hasPending } = $derived({
		hasConfirmed: registration.confirmed?.length || 0 > 0,
		hasPending: registration.pending?.length || 0 > 0
	});
</script>

<MemberTable>
	{#if hasConfirmed}
		<MemberTableRow title={`${roleLabel} confirmés`}>
			<Avatars mode="avatar-and-handle" members={registration.confirmed || []} />
		</MemberTableRow>
	{/if}
	{#if hasPending}
		<MemberTableRow title={`${roleLabel} en attente`}>
			<Avatars mode="avatar-and-handle" members={registration.pending || []} />
		</MemberTableRow>
	{/if}
	{#if !hasConfirmed && !hasPending}
		<tr>
			<td colspan="2">Encore aucune inscription</td>
		</tr>
	{/if}
</MemberTable>
