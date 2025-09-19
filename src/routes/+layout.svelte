<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import Calendar from '@lucide/svelte/icons/calendar';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import CalendarX from '@lucide/svelte/icons/calendar-x';
	import Dices from '@lucide/svelte/icons/dices';
	import CircleUser from '@lucide/svelte/icons/circle-user';
	import Sword from '@lucide/svelte/icons/sword';
	import Swords from '@lucide/svelte/icons/swords';
	import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
	import MenuItem from '$lib/components/menu-item.svelte';

	const { data: propsData, children } = $props();

	const { supabase, session } = propsData;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>RPG Club App</title>
</svelte:head>

<AppBar
	headlineClasses="sm:hidden"
	centerClasses="hidden sm:flex items-center justify-center"
	classes="mb-12"
	trailSpaceX="space-x-2"
>
	{#snippet lead()}
		<a href="/">
			<img src="/assets/ROCKNOLISTES-logo.png" alt="RPG Club App Logo" class="size-8 rounded-lg" />
		</a>
	{/snippet}
	{#snippet trail()}
		<MenuItem tooltip="Membres" link="/members">
			<CircleUser size={20} />
		</MenuItem>
		<MenuItem tooltip="Jeux" link="/games">
			<Dices size={20} />
		</MenuItem>
		<MenuItem tooltip="Événements" link="/events">
			<CalendarDays size={20} />
		</MenuItem>
		<MenuItem tooltip="Disponibilités" link="/availabilities">
			<CalendarX size={20} />
		</MenuItem>
		<MenuItem tooltip="Calendrier" link="/calendar">
			<Calendar size={20} />
		</MenuItem>
		<MenuItem tooltip="One Shots" link="/os">
			<Sword size={20} />
		</MenuItem>
		<MenuItem tooltip="Campagnes" link="/campaigns">
			<Swords size={20} />
		</MenuItem>
		<MenuItem tooltip="Stats" link="/stats">
			<ChartNoAxesCombined size={20} />
		</MenuItem>
	{/snippet}
	{#snippet headline()}
		<h2 class="h2">RPG Club App</h2>
	{/snippet}
	<span>RPG Club App</span>
</AppBar>

{@render children()}
