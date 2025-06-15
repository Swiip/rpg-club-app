<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmRegistrationButton from '$lib/components/registration/confirm-registration-button.svelte';
	import SignoutRegistrationButton from '$lib/components/registration/signout-registration-button.svelte';
	import SignupRegistrationButton from '$lib/components/registration/signup-registration-button.svelte';
	import UnconfirmRegistrationButton from '$lib/components/registration/unconfirm-registration-button.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';
	import type { Campaign } from '$lib/types';

	const { data } = $props();
	const { member, events, campaigns } = data;

	let addSessionMode = $state<string | undefined>(undefined);

	const handleClick = (campaign: Campaign | undefined) => () => {
		goto(`/campaigns/${campaign?.id ? campaign.id : 'new'}/edit`);
	};

	const handleStopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const handleSwitchSessionMode = (id: string | undefined) => {
		addSessionMode = id;
	};

	const registrations = $derived(computeRegistrations(campaigns, member));
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Title</th>
				<th>Game</th>
				<th>Sessions</th>
				<th>GM</th>
				<th>Players</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if campaigns && campaigns.length > 0}
				{#each campaigns as campaign (campaign.id)}
					<tr onclick={handleClick(campaign)} class="cursor-pointer">
						<td>{campaign.title}</td>
						<td>{campaign.game.name}</td>
						<td onclick={handleStopPropagation}>
							<ul>
								{#each campaign.session as session (session.id)}
									<li>
										{session.event.date}
										{#if addSessionMode === campaign.id}
											<form method="POST" action="?/delete-session">
												<input type="hidden" name="campaign" value={campaign.id} />
												<input type="hidden" name="event" value={session.event.id} />
												<button class="btn preset-tonal-error">X</button>
											</form>
										{/if}
									</li>
								{/each}
							</ul>
							{#if addSessionMode === campaign.id}
								<form method="POST" action="?/add-session">
									<input type="hidden" name="campaign" value={campaign.id} />
									<select class="select" name="event" required>
										{#if events && events.length > 0}
											{#each events as event (event.id)}
												<option value={event.id}>{event.date}</option>
											{/each}
										{/if}
									</select>
									<button
										class="btn preset-tonal-error"
										onclick={() => handleSwitchSessionMode(undefined)}
									>
										Cancel
									</button>
									<button class="btn preset-tonal-primary"> Add </button>
								</form>
							{:else}
								<button
									class="btn preset-tonal-primary"
									onclick={() => handleSwitchSessionMode(campaign.id)}
								>
									Edit
								</button>
							{/if}
						</td>
						<td>{campaign.gm.handle}</td>
						<td>
							{#if registrations[campaign.id]?.confirmed}
								<p>Confirmed: {registrations[campaign.id]?.confirmed}</p>
							{/if}
							{#if registrations[campaign.id]?.pending}
								<p>Pending: {registrations[campaign.id]?.pending}</p>
							{/if}
						</td>
						<td onclick={handleStopPropagation}>
							{#if registrations[campaign.id]?.role === 'gm'}
								{#each campaign.registration as registration (registration.id)}
									{#if registration.confirmation}
										<UnconfirmRegistrationButton
											targetId={campaign.id}
											memberId={registration.member.id}
											memberHandle={registration.member.handle}
										/>
									{:else}
										<ConfirmRegistrationButton
											targetId={campaign.id}
											memberId={registration.member.id}
											memberHandle={registration.member.handle}
										/>
									{/if}
								{/each}
							{:else if registrations[campaign.id]?.role === 'registered'}
								<SignoutRegistrationButton targetId={campaign.id} memberId={member.id} />
							{:else}
								<SignupRegistrationButton targetId={campaign.id} memberId={member.id} />
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
