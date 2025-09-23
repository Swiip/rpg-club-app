import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchMembers } from '$lib/supabase/members';
import { fetchAllEvents } from '$lib/supabase/events';
import { fetchOs } from '$lib/supabase/os';
import { fetchGames } from '$lib/supabase/games';
import { save } from '$lib/actions/os';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result =
		params.id === 'new' ? { data: undefined } : await fetchOs(supabase, Number(params.id));

	const gamesResult = await fetchGames(supabase);
	const membersResult = await fetchMembers(supabase);
	const eventsResult = await fetchAllEvents(supabase);

	return {
		games: gamesResult.data,
		members: membersResult.data,
		events: eventsResult.data,
		os: result.data,
		member
	};
};

export const actions = { save } satisfies Actions;
