import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { formatDateInput } from '$lib/logic/dates';
import { fetchEventsForStats } from '$lib/supabase/events';
import type { Dir, Sort } from '$lib/logic/stats';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const startParam = url.searchParams.get('start');
	const endParam = url.searchParams.get('end');
	const sortParam = url.searchParams.get('sort');
	const dirParam = url.searchParams.get('dir');

	const currentYear = new Date().getFullYear();
	const start = formatDateInput(startParam ?? `${currentYear}-09-01`);
	const end = formatDateInput(endParam);
	const sort: Sort = (sortParam as Sort) || 'member';
	const dir: Dir = (dirParam as Dir) || 'asc';

	const result = await fetchEventsForStats(supabase, start, end);

	return {
		events: result.data || [],
		start,
		end,
		sort,
		dir
	};
};
