import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchOses } from '$lib/supabase/os';
import type { Actions } from '../games/[id]/edit/$types';
import { createRegistration, deleteRegistration } from '$lib/supabase/registrations';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result = await fetchOses(supabase);

	return {
		oses: result.data,
		member
	};
};

const changeRegistration = async (
	supabase: SupabaseClient,
	request: Request,
	operation: typeof createRegistration
) => {
	const formData = await request.formData();
	const id = formData.get('id');
	const memberId = formData.get('memberId');

	if (!id || typeof id !== 'string') {
		return fail(400, { id, missing: true });
	}

	if (!memberId || typeof memberId !== 'string') {
		return fail(400, { id, missing: true });
	}

	return operation(supabase, memberId, 'os', id);
};

export const actions = {
	signup: async ({ locals: { supabase }, request }) => {
		return changeRegistration(supabase, request, createRegistration);
	},
	signout: async ({ locals: { supabase }, request }) => {
		return changeRegistration(supabase, request, deleteRegistration);
	}
} satisfies Actions;
