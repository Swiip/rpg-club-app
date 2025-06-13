import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { authGuard } from '$lib/supabase/auth';
import { fetchEvents } from '$lib/supabase/events';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result = await fetchEvents(supabase);

	return {
		events: result.data,
		member
	};
};
