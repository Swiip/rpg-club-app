<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Os } from '$lib/types';

	const { data } = $props();
	const { member, oses } = data;

	const handleClick = (os: Os | undefined) => () => {
		goto(`/os/${os?.id ? os.id : 'new'}/edit`);
	};

	const handleStopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const registrations = $derived.by(() => {
		const registrations: Record<string, { confirmed: string; pending: string; up: boolean }> = {};
		oses?.forEach((os) => {
			const confirmed = os.registration
				.filter((r) => r.confirmation)
				.map((r) => r.member.handle)
				.join(', ');
			const pending = os.registration
				.filter((r) => !r.confirmation)
				.map((r) => r.member.handle)
				.join(', ');
			const up = !!os.registration.find((r) => r.member.id === member.id);

			registrations[os.id] = { confirmed, pending, up };
		});
		return registrations;
	});
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
							<form method="POST">
								<input type="hidden" name="id" value={os.id} />
								<input type="hidden" name="memberId" value={member.id} />
								{#if registrations[os.id]?.up}
									<button class="btn preset-tonal-error" formaction="?/signout">Sign Out</button>
								{:else}
									<button class="btn preset-tonal-primary" formaction="?/signup">Sign Up</button>
								{/if}
							</form>
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
