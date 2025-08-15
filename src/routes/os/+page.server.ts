import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchOses } from '$lib/supabase/os';
import type { Actions } from '../games/[id]/edit/$types';
import { type RegistrationAction } from '$lib/supabase/registrations';
import { fetchMembers } from '$lib/supabase/members';
import { updateRegistration } from '$lib/supabase/registrations';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const result = await fetchOses(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		oses: result.data || [],
		members: membersResult.data || []
	};
};

export const actions = {
	registration: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const targetId = Number(formData.get('targetId'));
		const memberId = Number(formData.get('memberId'));
		const action = formData.get('action') as RegistrationAction;
		return updateRegistration(supabase, action, memberId, 'os', targetId);
	}
} satisfies Actions;
