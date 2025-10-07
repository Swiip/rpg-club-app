<script lang="ts">
	import type { Table } from '$lib/logic/calendar';
	import Avatar from '../avatar.svelte';
	import Avatars from '../avatars.svelte';
	import MemberTableRow from '../table/member-table-row.svelte';
	import MemberTable from '../table/member-table.svelte';

	type Props = {
		table: Table;
	};

	let { table }: Props = $props();
</script>

<MemberTable>
	{#if table.type === 'os' || table.type === 'campaign'}
		<MemberTableRow title="Jeu">
			{table.game.name}
		</MemberTableRow>
		<MemberTableRow title="MJ">
			<Avatar mode="avatar-and-handle" member={table.gm} />
		</MemberTableRow>
		<MemberTableRow title="PJs">
			<Avatars
				mode="avatar-and-handle"
				members={table.registration.map((registration) => registration.member)}
			/>
		</MemberTableRow>
	{:else}
		<MemberTableRow title="Jeu de société">
			{table.boardgame_games.map(({ game }) => game.name).join(', ')}
		</MemberTableRow>
		<MemberTableRow title="Joueurs">
			<Avatars
				mode="avatar-and-handle"
				members={table.registration.map((registration) => registration.member)}
			/>
		</MemberTableRow>
	{/if}
</MemberTable>
