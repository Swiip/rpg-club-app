import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import type { Actions } from '../games/[id]/edit/$types';
import { fetchMembers } from '$lib/supabase/members';
import { registration } from '$lib/actions/registration';
import { deleteAction, games } from '$lib/actions/boardgame';
import { fetchBoardgames } from '$lib/supabase/boardgames';
import { fetchGames } from '$lib/supabase/games';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const isFuture = url.searchParams.get('past') === null;

	const result = await fetchBoardgames(supabase, isFuture);
	const membersResult = await fetchMembers(supabase);
	const gamesResult = await fetchGames(supabase, 'bg');

	return {
		boardgames: result.data || [],
		members: membersResult.data || [],
		games: gamesResult.data || []
	};
};

export const actions = {
	registration: registration('boardgame'),
	delete: deleteAction,
	games
} satisfies Actions;
