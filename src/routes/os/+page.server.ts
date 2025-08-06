import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchOses } from '$lib/supabase/os';
import type { Actions } from '../games/[id]/edit/$types';
import {
	createRegistration,
	deleteRegistration,
	updateRegistrationConfirmation,
	type RegistrationAction
} from '$lib/supabase/registrations';
import { fetchMembers } from '$lib/supabase/members';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const result = await fetchOses(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		oses: result.data || undefined,
		members: membersResult.data
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
				return createRegistration(supabase, memberId, 'os', targetId);
			case 'delete':
				return deleteRegistration(supabase, memberId, 'os', targetId);
			case 'confirm':
				return updateRegistrationConfirmation(supabase, memberId, 'os', targetId, true);
			case 'unconfirm':
				return updateRegistrationConfirmation(supabase, memberId, 'os', targetId, false);
			default:
				throw fail(400, { action, missing: true });
		}
	}
} satisfies Actions;
