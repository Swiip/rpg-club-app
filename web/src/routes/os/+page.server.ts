import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchOses } from '$lib/supabase/os';
import type { Actions } from '../games/[id]/edit/$types';
import {
	createRegistration,
	deleteRegistration,
	updateRegistrationConfirmation
} from '$lib/supabase/registrations';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result = await fetchOses(supabase);

	return {
		oses: result.data || undefined,
		member
	};
};

const readFormData = async (request: Request) => {
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

export const actions = {
	signup: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readFormData(request);
		return createRegistration(supabase, memberId, 'os', targetId);
	},
	signout: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readFormData(request);
		return deleteRegistration(supabase, memberId, 'os', targetId);
	},
	confirm: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readFormData(request);
		return updateRegistrationConfirmation(supabase, memberId, 'os', targetId, true);
	},
	unconfirm: async ({ locals: { supabase }, request }) => {
		const { targetId, memberId } = await readFormData(request);
		return updateRegistrationConfirmation(supabase, memberId, 'os', targetId, false);
	}
} satisfies Actions;
