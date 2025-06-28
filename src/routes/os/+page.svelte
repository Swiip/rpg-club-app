<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmRegistrationButton from '$lib/components/registration/confirm-registration-button.svelte';
	import SignoutRegistrationButton from '$lib/components/registration/signout-registration-button.svelte';
	import SignupRegistrationButton from '$lib/components/registration/signup-registration-button.svelte';
	import UnconfirmRegistrationButton from '$lib/components/registration/unconfirm-registration-button.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';
	import type { Os } from '$lib/types';

	const { data } = $props();
	const { member, oses } = data;

	const handleClick = (os: Os | undefined) => () => {
		goto(`/os/${os?.id ? os.id : 'new'}/edit`);
	};

	const handleStopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const registrations = $derived(computeRegistrations(oses, member));
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Date</th>
				<th>Title</th>
				<th>Game</th>
				<th>GM</th>
				<th>Players</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if oses && oses.length > 0}
				{#each oses as os (os.id)}
					<tr onclick={handleClick(os)} class="cursor-pointer">
						<td>{os.event.date}</td>
						<td>{os.title}</td>
						<td>{os.game.name}</td>
						<td>{os.gm.handle}</td>
						<td>
							{#if registrations[os.id]?.confirmed}
								<p>Confirmed: {registrations[os.id]?.confirmed}</p>
							{/if}
							{#if registrations[os.id]?.pending}
								<p>Pending: {registrations[os.id]?.pending}</p>
							{/if}
						</td>
						<td onclick={handleStopPropagation}>
							{#if registrations[os.id]?.role === 'gm'}
								{#each os.registration as registration (registration.id)}
									{#if registration.confirmation}
										<UnconfirmRegistrationButton
											targetId={os.id}
											memberId={registration.member.id}
											memberHandle={registration.member.handle}
										/>
									{:else}
										<ConfirmRegistrationButton
											targetId={os.id}
											memberId={registration.member.id}
											memberHandle={registration.member.handle}
										/>
									{/if}
								{/each}
							{:else if registrations[os.id]?.role === 'registered'}
								<SignoutRegistrationButton targetId={os.id} memberId={member.id} />
							{:else}
								<SignupRegistrationButton targetId={os.id} memberId={member.id} />
							{/if}
						</td>
					</tr>
				{/each}
			{/if}
			<tr onclick={handleClick(undefined)} class="cursor-pointer text-center">
				<td colspan="100">+</td>
			</tr>
		</tbody>
	</table>
</div>
