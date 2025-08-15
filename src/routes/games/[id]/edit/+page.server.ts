import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { authGuard } from '$lib/supabase/auth';
import { fetchGame } from '$lib/supabase/games';
import { upsertGame } from '$lib/supabase/games';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result =
		params.id === 'new' ? { data: undefined } : await fetchGame(supabase, Number(params.id));

	return {
		game: result.data,
		member
	};
};

export const actions = {
	save: async ({ locals: { supabase }, request, params }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const description = String(data.get('description'));
		const illustration = String(data.get('illustration'));

		const id = params.id === 'new' ? undefined : Number(params.id);

		const result = await upsertGame(supabase, { id, name, description, illustration });

		if (result.error) {
			console.error('Error on saving', result.error.message);
			return fail(500, { error: result.error.message });
		}

		redirect(303, '/games');
	}
} satisfies Actions;
