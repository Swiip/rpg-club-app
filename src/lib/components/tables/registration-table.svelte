<script lang="ts">
	import { computeRegistration, type RegistrionModel } from '$lib/logic/registrations';
	import type { WithRegistration } from '$lib/supabase/types';
	import Avatars from '../avatars.svelte';

	type Props = {
		withRegistration: WithRegistration;
	};

	let { withRegistration }: Props = $props();
	let registration: RegistrionModel = $derived(computeRegistration(withRegistration));
	let { hasConfirmed, hasPending } = $derived({
		hasConfirmed: registration.confirmed?.length || 0 > 0,
		hasPending: registration.pending?.length || 0 > 0
	});
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if hasConfirmed}
				<tr>
					<td>PJs confirmés</td>
					<td>
						<div class="flex flex-wrap gap-1">
							<Avatars mode="avatar-and-handle" members={registration.confirmed || []} />
						</div>
					</td>
				</tr>
			{/if}
			{#if hasPending}
				<tr>
					<td>PJs en attente</td>
					<td>
						<div class="flex flex-wrap gap-1">
							<Avatars mode="avatar-and-handle" members={registration.pending || []} />
						</div>
					</td>
				</tr>
			{/if}
			{#if !hasConfirmed && !hasPending}
				<tr>
					<td colspan="2">Encore aucune inscription</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
