<script lang="ts">
	import SupabaseImage from '$lib/components/image/supabase-image.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Member, Os } from '$lib/types';
	import type { RegistrionModel } from '$lib/logic/registrations';
	import Pen from '@lucide/svelte/icons/pen';
	import { goto } from '$app/navigation';
	import SvelteMarkdown from 'svelte-markdown';
	import UnconfirmRegistrationButton from './registration/unconfirm-registration-button.svelte';
	import ConfirmRegistrationButton from './registration/confirm-registration-button.svelte';
	import SignoutRegistrationButton from './registration/signout-registration-button.svelte';
	import SignupRegistrationButton from './registration/signup-registration-button.svelte';

	type Props = {
		member: Member;
		os: Os;
		registration: RegistrionModel;
		supabase: SupabaseClient;
	};

	const { member, os, registration, supabase }: Props = $props();
	let showDetails = $state(false);

	const handleClick = (os: Os | undefined) => () => {
		goto(`/os/${os?.id ? os.id : 'new'}/edit`);
	};
</script>

<section
	class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block w-full divide-y overflow-hidden rounded-xl border"
>
	<header class="flex items-center justify-between gap-4">
		<div class="relative w-full">
			<SupabaseImage
				{supabase}
				bucket="game-banners"
				url={os.game.illustration}
				alt={os.game.name}
				className="aspect-[21/9] w-full object-cover"
			/>
			<p class="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-lg">
				{os.title}
			</p>
			<button
				class="btn-icon preset-tonal-primary absolute top-4 right-4"
				onclick={handleClick(os)}
			>
				<Pen size={16} />
			</button>
		</div>
	</header>
	<article class="flex flex-col gap-4 p-4">
		<!-- <p class="mx-4">MJ: {os.gm.handle}</p> -->
		<div class="flex items-center justify-between gap-4">
			<span class="opacity-60">MJ: {os.gm.handle}</span>
			<small class="opacity-60">
				{new Date(os.event.date).toLocaleString(navigator.language, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					weekday: 'long'
				})}
			</small>
		</div>

		{#if !showDetails || registration.role !== 'gm'}
			{#if registration.confirmed}
				<p>PJs confirmés: {registration.confirmed}</p>
			{/if}
			{#if registration.pending}
				<p>PJs en attente: {registration.pending}</p>
			{/if}
		{/if}

		{#if showDetails}
			{#if registration.role === 'gm'}
				{#if os.registration.length === 0}
					<p class="text-center">Aucune inscription pour le moment</p>
				{:else}
					<div class="table-wrap mx-auto max-w-4xl">
						<table class="table caption-bottom">
							<thead>
								<tr>
									<th>Membre</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody class="[&>tr]:hover:preset-tonal-primary">
								{#each os.registration as registration (registration.id)}
									<tr>
										<td>{registration.member.handle}</td>
										<td>
											{#if registration.confirmation}
												<UnconfirmRegistrationButton
													targetId={os.id}
													memberId={registration.member.id}
												/>
											{:else}
												<ConfirmRegistrationButton
													targetId={os.id}
													memberId={registration.member.id}
												/>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>{/if}
			{:else if registration.role === 'registered'}
				<div class="mx-auto">
					<SignoutRegistrationButton targetId={os.id} memberId={member.id} />
				</div>
			{:else}
				<div class="mx-auto">
					<SignupRegistrationButton targetId={os.id} memberId={member.id} />
				</div>
			{/if}
		{/if}

		{#if showDetails}
			{#if os.description}
				<p class="prose prose-invert prose-sm m-auto w-full">
					<SvelteMarkdown source={os.description || ''} />
				</p>
			{:else}
				<p class="prose prose-invert prose-sm m-auto w-full">Pas de description</p>
			{/if}
		{/if}

		<button
			class="btn preset-tonal-primary self-center justify-self-center"
			onclick={() => (showDetails = !showDetails)}
		>
			{#if showDetails}
				Moins <ChevronUp size={16} />
			{:else}
				Plus <ChevronDown size={16} />
			{/if}
		</button>
	</article>
</section>
