<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	const { data } = $props();
	const { members } = data;

	const handleStopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Handle</th>
				<th>Avatar</th>
				<th>Authorized</th>
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
							{member.authorized ? 'Yes' : 'No'}
						</td>
						<td onclick={handleStopPropagation}>
							<form method="POST">
								<input type="hidden" name="id" value={member.id} />
								{#if member.authorized}
									<button class="btn preset-tonal-error" formaction="?/unauthorize">
										Unauthorize
									</button>
								{:else}
									<button class="btn preset-tonal-primary" formaction="?/authorize">
										Authorize
									</button>
								{/if}
							</form>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
