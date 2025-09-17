import { createSession, deleteSession, type SessionAction } from '$lib/supabase/sessions';
import { fail, type Action } from '@sveltejs/kit';

export const session: Action = async ({ locals: { supabase }, request }) => {
	const formData = await request.formData();
	const campaignId = Number(formData.get('campaignId'));
	const eventId = Number(formData.get('eventId'));
	const action = formData.get('action') as SessionAction;

	switch (action) {
		case 'add':
			return createSession(supabase, campaignId, eventId);
		case 'delete':
			return deleteSession(supabase, campaignId, eventId);
		default:
			throw fail(400, { action, missing: true });
	}
};
