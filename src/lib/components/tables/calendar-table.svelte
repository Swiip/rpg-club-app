<script lang="ts">
	import type { Table } from '$lib/logic/calendar';
	import Avatar from '../avatar.svelte';
	import Avatars from '../avatars.svelte';

	type Props = {
		table: Table;
	};

	let { table }: Props = $props();
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			<tr>
				<td>Jeu</td>
				<td>{table.game.name}</td>
			</tr>
			<tr>
				<td>MJ</td>
				<td>
					<div class="flex flex-wrap gap-1">
						<Avatar mode="avatar-and-handle" member={table.gm} />
					</div>
				</td>
			</tr>
			<tr>
				<td>PJs</td>
				<td>
					<div class="flex flex-wrap gap-1">
						<Avatars
							mode="avatar-and-handle"
							members={table.registration.map((registration) => registration.member)}
						/>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
