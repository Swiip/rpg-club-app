import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchEvent, upsertEvent } from '$lib/supabase/events';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result =
		params.id === 'new'
			? {
					data: {
						id: undefined,
						date: undefined,
						start: '19:30',
						end: '23:30',
						location: 'Les Érables'
					}
				}
			: await fetchEvent(supabase, params.id);

	return {
		event: result.data,
		member
	};
};

export const actions = {
	save: async ({ locals: { supabase }, request, params }) => {
		const data = await request.formData();
		const date = data.get('date');
		const start = data.get('start');
		const end = data.get('end');
		const location = data.get('location');

		if (!date || typeof date !== 'string') {
			return fail(400, { date, missing: true });
		}

		if (!start || typeof start !== 'string') {
			return fail(400, { start, missing: true });
		}

		if (!end || typeof end !== 'string') {
			return fail(400, { end, missing: true });
		}

		if (!location || typeof location !== 'string') {
			return fail(400, { location, missing: true });
		}

		const id = params.id === 'new' ? undefined : params.id;

		const result = await upsertEvent(supabase, { id, date, start, end, location });

		if (result.error) {
			console.error('Error on saving', result.error.message);
			return fail(500, { error: result.error.message });
		}

		redirect(303, '/events');
	}
} satisfies Actions;
