import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { deleteOs, fetchOses } from '$lib/supabase/os';
import type { Actions } from '../games/[id]/edit/$types';
import { fetchMembers } from '$lib/supabase/members';
import { registration } from '$lib/actions/registration';

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const isFuture = url.searchParams.get('past') === null;

	const result = await fetchOses(supabase, isFuture);
	const membersResult = await fetchMembers(supabase);

	return {
		oses: result.data || [],
		members: membersResult.data || []
	};
};

export const actions = {
	registration,
	delete: async ({ locals: { supabase }, request }) => {
		const formData = await request.formData();
		const osId = Number(formData.get('osId'));
		return deleteOs(supabase, osId);
	}
} satisfies Actions;
