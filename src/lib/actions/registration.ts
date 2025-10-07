import { updateRegistration, type RegistrationAction } from '$lib/supabase/registrations';
import type { Action } from '@sveltejs/kit';

export const registration =
	(type: 'os' | 'campaign' | 'boardgame'): Action =>
	async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = Number(formData.get('targetId'));
		const memberId = Number(formData.get('memberId'));
		const action = formData.get('action') as RegistrationAction;
		return updateRegistration(supabase, action, memberId, type, targetId);
	};
