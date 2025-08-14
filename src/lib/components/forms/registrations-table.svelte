<script lang="ts">
	import type { Member, Registration } from '$lib/types';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import type { RegistrationAction } from '$lib/supabase/registrations';
	import { enhance } from '$app/forms';

	type Props = {
		targetId: string;
		registrations: Registration[];
		members: Member[];
	};

	let { targetId, registrations: unorderedRegistrations, members }: Props = $props();
	let registrations = $derived(
		unorderedRegistrations.sort((a, b) => a.member.handle.localeCompare(b.member.handle))
	);
	let memberId = $state<string | undefined>();
	let action = $state<RegistrationAction | undefined>();
	let newMemberId = $state<string | undefined>();

	const handleClick = (newAction: RegistrationAction, id: string | undefined) => () => {
		action = newAction;
		memberId = id;
	};
</script>

<form method="POST" action="?/registration" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="targetId" type="hidden" value={targetId} />
	<input name="memberId" type="hidden" value={memberId} />
	<input name="action" type="hidden" value={action} />
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Membre</th>
				<th>Statut</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each registrations as { id, confirmation, member } (id)}
				<tr>
					<td>{member.handle}</td>
					<td>{confirmation ? 'Confirmé' : 'Non confirmé'}</td>
					<td>
						{#if confirmation}
							<button
								class="btn-icon preset-tonal-warning"
								onclick={handleClick('unconfirm', member.id)}
							>
								<X size={16} />
							</button>
						{:else}
							<button
								class="btn-icon preset-tonal-success"
								onclick={handleClick('confirm', member.id)}
							>
								<Check size={16} />
							</button>
						{/if}
						<button class="btn-icon preset-tonal-error" onclick={handleClick('delete', member.id)}>
							<Trash size={16} />
						</button>
					</td>
				</tr>
			{/each}
			<tr>
				<td colspan="2">
					<select class="select" name="new" bind:value={newMemberId}>
						{#if members && members.length > 0}
							{#each members as { id, handle } (id)}
								<option value={id}>{handle}</option>
							{/each}
						{/if}
					</select>
				</td>
				<td>
					<button class="btn-icon preset-tonal-primary" onclick={handleClick('add', newMemberId)}>
						<Plus size={16} />
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</form>
