<script lang="ts">
	import type { MemberView } from '$lib/supabase/members';
	import { Avatar, Tooltip } from '@skeletonlabs/skeleton-svelte';

	type Props = {
		mode: 'big-avatar' | 'small-avatar' | 'avatar-and-handle' | 'only-handle';
		member: MemberView;
	};

	let { mode, member }: Props = $props();
	let { showAvatar, showHandle, avatarSize } = $derived({
		showAvatar: mode.includes('avatar'),
		showHandle: mode.includes('handle'),
		avatarSize: mode === 'big-avatar' ? 'size-16' : 'size-6'
	});
	let openState = $state(false);
</script>

<span class="inline-flex h-fit items-center justify-center gap-1">
	{#if showAvatar}
		<Tooltip
			open={openState}
			onOpenChange={(e) => (openState = e.open)}
			positioning={{ placement: 'top' }}
			base="inline-flex h-fit"
			triggerBase="inline-flex h-fit"
			contentBase="card preset-filled p-2"
			openDelay={200}
			arrow
		>
			{#snippet trigger()}
				<Avatar src={member.avatar || undefined} name={member.handle} size={avatarSize} />
			{/snippet}
			{#snippet content()}{member.handle}{/snippet}
		</Tooltip>
	{/if}

	{#if showHandle}
		{member.handle}
	{/if}
</span>
