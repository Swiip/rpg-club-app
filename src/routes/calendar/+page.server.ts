import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { authGuard } from '$lib/supabase/auth';
import { fetchEventsForCalendar } from '$lib/supabase/events';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const isFuture = url.searchParams.get('past') === null;

	const result = await fetchEventsForCalendar(supabase, isFuture);

	return {
		events: result.data ?? [],
		member
	};
};
