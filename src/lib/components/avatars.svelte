<script lang="ts">
	import type { MemberView } from '$lib/supabase/members';
	import Avatar from './avatar.svelte';

	type ArrayOrSet<T> = Array<T> | Set<T>;

	type Props = {
		mode: 'big-avatar' | 'small-avatar' | 'avatar-and-handle' | 'only-handle';
		members: ArrayOrSet<MemberView>;
	};

	let { mode, members }: Props = $props();
</script>

{#each members as member, i (member.handle)}
	{i === 0 ? '' : ' - '}<Avatar {mode} {member} />
{/each}
