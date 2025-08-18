import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchMembers } from '$lib/supabase/members';
import { fetchAllEvents } from '$lib/supabase/events';
import { fetchOs, upsertOs } from '$lib/supabase/os';
import { fetchGames } from '$lib/supabase/games';

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

export const actions = {
	save: async ({ locals: { supabase }, request, params }) => {
		const data = await request.formData();
		const title = String(data.get('title'));
		const description = String(data.get('description'));
		const game = Number(data.get('game'));
		const gm = Number(data.get('gm'));
		const event = Number(data.get('event'));

		const id = params.id === 'new' ? undefined : Number(params.id);

		const result = await upsertOs(supabase, { id, title, description, game, gm, event });

		if (result.error) {
			console.error('Error on saving', result.error.message);
			return fail(500, { error: result.error.message });
		}

		redirect(303, '/os');
	}
} satisfies Actions;
