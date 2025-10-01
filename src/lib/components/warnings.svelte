<script lang="ts">
	import { getWarningFlags, type Warnings } from '$lib/logic/warnings';
	import Avatars from './avatars.svelte';

	type Props = {
		warnings: Warnings;
	};

	let { warnings }: Props = $props();
	let flags = $derived(getWarningFlags(warnings));
</script>

{#if flags.hasWarnings}
	<table class="table caption-bottom">
		<tbody>
			{#if flags.hasDuplicates}
				<tr class="text-error-700-300">
					<td>Doublons</td>
					<td class="w-full">
						<Avatars mode="avatar-and-handle" members={warnings.duplicates} />
					</td>
				</tr>
			{/if}
			{#if flags.hasOffs}
				<tr class="text-error-700-300">
					<td>Indispos</td>
					<td class="w-full">
						<Avatars mode="avatar-and-handle" members={warnings.unavailabilities.off} />
					</td>
				</tr>
			{/if}
			{#if flags.hasMaybes}
				<tr class="text-warning-700-300">
					<td class="whitespace-nowrap">Peut être</td>
					<td class="w-full">
						<Avatars mode="avatar-and-handle" members={warnings.unavailabilities.maybe} />
					</td>
				</tr>
			{/if}
			{#if flags.hasUnsets}
				<tr>
					<td class="whitespace-nowrap">Non renseignés</td>
					<td class="w-full">
						<Avatars mode="avatar-and-handle" members={warnings.unavailabilities.unset} />
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
{:else}
	<p>Aucun problème détecté</p>
{/if}
