import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import type { Actions } from '../games/[id]/edit/$types';
import {
	createRegistration,
	deleteRegistration,
	updateRegistrationConfirmation,
	type RegistrationAction
} from '$lib/supabase/registrations';
import { fetchCampaigns } from '$lib/supabase/campaigns';
import { fetchEvents } from '$lib/supabase/events';
import { createSession, deleteSession, type SessionAction } from '$lib/supabase/sessions';
import { fetchMembers } from '$lib/supabase/members';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const campaignsResult = await fetchCampaigns(supabase);
	const eventsResult = await fetchEvents(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		campaigns: campaignsResult.data || undefined,
		events: eventsResult.data || undefined,
		members: membersResult.data || undefined
	};
};

export const actions = {
	registration: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = formData.get('targetId') as string;
		const memberId = formData.get('memberId') as string;
		const action = formData.get('action') as RegistrationAction;

		switch (action) {
			case 'add':
				return createRegistration(supabase, memberId, 'campaign', targetId);
			case 'delete':
				return deleteRegistration(supabase, memberId, 'campaign', targetId);
			case 'confirm':
				return updateRegistrationConfirmation(supabase, memberId, 'campaign', targetId, true);
			case 'unconfirm':
				return updateRegistrationConfirmation(supabase, memberId, 'campaign', targetId, false);
			default:
				throw fail(400, { action, missing: true });
		}
	},
	session: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = formData.get('targetId') as string;
		const eventId = formData.get('eventId') as string;
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
