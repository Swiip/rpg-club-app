import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchMembers } from '$lib/supabase/members';
import { fetchGames } from '$lib/supabase/games';
import { fetchCampaign, upsertCampaign } from '$lib/supabase/campaigns';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result =
		params.id === 'new' ? { data: undefined } : await fetchCampaign(supabase, params.id);

	const gamesResult = await fetchGames(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		games: gamesResult.data,
		members: membersResult.data,
		campaign: result.data,
		member
	};
};

export const actions = {
	save: async ({ locals: { supabase }, request, params }) => {
		const data = await request.formData();
		const title = data.get('title');
		const game = data.get('game');
		const gm = data.get('gm');

		if (!title || typeof title !== 'string') {
			return fail(400, { title, missing: true });
		}

		if (!game || typeof game !== 'string') {
			return fail(400, { game, missing: true });
		}

		if (!gm || typeof gm !== 'string') {
			return fail(400, { gm, missing: true });
		}

		const id = params.id === 'new' ? undefined : params.id;

		const result = await upsertCampaign(supabase, { id, title, game, gm });

		if (result.error) {
			console.error('Error on saving', result.error.message);
			return fail(500, { error: result.error.message });
		}

		redirect(303, '/campaigns');
	}
} satisfies Actions;
