<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	const { data } = $props();
	const { members } = data;

	const handleStopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};
</script>

<Container>
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Discord</th>
				<th>Avatar</th>
				<th>Autorisé</th>
			</tr>
		</thead>
		<tbody>
			{#if members && members.length > 0}
				{#each members as member (member.id)}
					<tr>
						<td>{member.handle}</td>
						<td>
							{#if member.avatar}
								<Avatar src={member.avatar} name={member.handle} />
							{/if}
						</td>
						<td>
							{member.authorized ? 'Ok' : 'Non'}
						</td>
						<td onclick={handleStopPropagation}>
							<form method="POST">
								<input type="hidden" name="id" value={member.id} />
								{#if member.authorized}
									<button class="btn-icon preset-tonal-error" formaction="?/unauthorize">X</button>
								{:else}
									<button class="btn-icon preset-tonal-primary" formaction="?/authorize">✓</button>
								{/if}
							</form>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</Container>
