import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchCampaignWithJoins } from '$lib/supabase/campaigns';
import { fetchEventsForCalendar } from '$lib/supabase/events';
import { session } from '$lib/actions/session';

export const load: PageServerLoad = async ({
	locals: { supabase, safeGetSession },
	params,
	url
}) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const isFuture = url.searchParams.get('past') === null;
	const result = await fetchCampaignWithJoins(supabase, Number(params.id));
	const eventsResult = await fetchEventsForCalendar(supabase, isFuture);

	if (result.data === null) {
		return redirect(307, '/campaigns');
	}

	result.data.session.sort((a, b) => a.event.date.localeCompare(b.event.date));

	return { campaign: result.data, member, events: eventsResult.data || [] };
};

export const actions = { session };
