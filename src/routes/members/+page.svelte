<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import Container from '$lib/components/container.svelte';

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
							<Avatar mode="big-avatar" {member} />
						</td>
						<td>
							{member.authorized ? 'Autorisé' : 'Non autorisé'}
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
