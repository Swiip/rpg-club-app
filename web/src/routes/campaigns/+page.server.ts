import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import type { Actions } from '../games/[id]/edit/$types';
import {
	createRegistration,
	deleteRegistration,
	updateRegistrationConfirmation
} from '$lib/supabase/registrations';
import { fetchCampaigns } from '$lib/supabase/campaigns';
import { fetchEvents } from '$lib/supabase/events';
import { createSession, deleteSession } from '$lib/supabase/sessions';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const eventsResult = await fetchEvents(supabase);

	const result = await fetchCampaigns(supabase);

	console.log('coucou', result);

	return {
		campaigns: result.data || undefined,
		events: eventsResult.data || undefined,
		member
	};
};

const readRegistrationFormData = async (request: Request) => {
	const formData = await request.formData();
	const targetId = formData.get('targetId');
	const memberId = formData.get('memberId');

	if (!targetId || typeof targetId !== 'string') {
		throw fail(400, { targetId, missing: true });
	}

	if (!memberId || typeof memberId !== 'string') {
		throw fail(400, { memberId, missing: true });
	}

	return { targetId, memberId };
};

const readSessionFormData = async (request: Request) => {
	const formData = await request.formData();
	const campaignId = formData.get('campaign');
	const eventId = formData.get('event');

	if (!campaignId || typeof campaignId !== 'string') {
		throw fail(400, { campaignId, missing: true });
	}

	if (!eventId || typeof eventId !== 'string') {
		throw fail(400, { eventId, missing: true });
	}

	return { campaignId, eventId };
};

export const actions = {
	signup: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readRegistrationFormData(request);
		return createRegistration(supabase, memberId, 'campaign', targetId);
	},
	signout: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readRegistrationFormData(request);
		return deleteRegistration(supabase, memberId, 'campaign', targetId);
	},
	confirm: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readRegistrationFormData(request);
		return updateRegistrationConfirmation(supabase, memberId, 'campaign', targetId, true);
	},
	unconfirm: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readRegistrationFormData(request);
		return updateRegistrationConfirmation(supabase, memberId, 'campaign', targetId, false);
	},
	'add-session': async ({ locals: { supabase }, request }) => {
		const { campaignId, eventId } = await readSessionFormData(request);
		const result = await createSession(supabase, campaignId, eventId);
		console.log('add session', result);
		return result;
	},
	'delete-session': async ({ locals: { supabase }, request }) => {
		const { campaignId, eventId } = await readSessionFormData(request);
		return deleteSession(supabase, campaignId, eventId);
	}
} satisfies Actions;
