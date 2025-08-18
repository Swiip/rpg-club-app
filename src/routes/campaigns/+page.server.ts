import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import type { Actions } from '../games/[id]/edit/$types';
import { updateRegistration, type RegistrationAction } from '$lib/supabase/registrations';
import { fetchCampaigns } from '$lib/supabase/campaigns';
import { fetchAllEvents } from '$lib/supabase/events';
import { createSession, deleteSession, type SessionAction } from '$lib/supabase/sessions';
import { fetchMembers } from '$lib/supabase/members';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const campaignsResult = await fetchCampaigns(supabase);
	const eventsResult = await fetchAllEvents(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		campaigns: campaignsResult.data || [],
		events: eventsResult.data || [],
		members: membersResult.data || []
	};
};

export const actions = {
	registration: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = Number(formData.get('targetId'));
		const memberId = Number(formData.get('memberId'));
		const action = formData.get('action') as RegistrationAction;
		return updateRegistration(supabase, action, memberId, 'campaign', targetId);
	},
	session: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = Number(formData.get('targetId'));
		const eventId = Number(formData.get('eventId'));
		const action = formData.get('action') as SessionAction;

		switch (action) {
			case 'add':
				return createSession(supabase, targetId, eventId);
			case 'delete':
				return deleteSession(supabase, targetId, eventId);
			default:
				throw fail(400, { action, missing: true });
		}
	}
} satisfies Actions;
