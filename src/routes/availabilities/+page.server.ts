import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { authGuard } from '$lib/supabase/auth';
import { fetchEventsForAvailabilities } from '$lib/supabase/events';
import { updateAvailability, type AvailabilityStatus } from '$lib/supabase/availabilities';
import { parseId } from '$lib/logic/formData';
import { fetchMembers } from '$lib/supabase/members';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const isFuture = url.searchParams.get('past') === null;
	const memberId = Number(url.searchParams.get('member') ?? member.id);

	const result = await fetchEventsForAvailabilities(supabase, memberId, isFuture);
	const membersResult = await fetchMembers(supabase);

	return {
		events: result.data || [],
		member,
		members: membersResult.data || []
	};
};

export const actions = {
	availability: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const availabilityId = parseId(formData, 'availabilityId');
		const eventId = Number(formData.get('eventId'));
		const memberId = Number(formData.get('memberId'));
		const status = formData.get('status') as AvailabilityStatus;
		return await updateAvailability(supabase, availabilityId, status, eventId, memberId);
	}
} satisfies Actions;
