import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { authGuard } from '$lib/supabase/auth';
import { fetchGame, fetchGames } from '$lib/supabase/games';
import { upsertGame } from '$lib/supabase/games';
import { fetchMembers } from '$lib/supabase/members';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const gamesResult = await fetchGames(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		games: gamesResult.data,
		members: membersResult.data,
		member
	};
};

export const actions = {
	save: async ({ locals: { supabase }, request, params }) => {
		console.log('save');
	}
} satisfies Actions;
