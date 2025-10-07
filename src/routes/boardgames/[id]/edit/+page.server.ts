import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchAllEvents } from '$lib/supabase/events';
import { save } from '$lib/actions/boardgame';
import { fetchBoardgame } from '$lib/supabase/boardgames';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result =
		params.id === 'new' ? { data: undefined } : await fetchBoardgame(supabase, Number(params.id));

	const eventsResult = await fetchAllEvents(supabase);

	return {
		events: eventsResult.data,
		os: result.data,
		member
	};
};

export const actions = { save } satisfies Actions;
