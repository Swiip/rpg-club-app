import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchMembers, updateMemberAuthorization } from '$lib/supabase/members';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	const { member } = await authGuard(session, supabase, redirect);

	const result = await fetchMembers(supabase);

	return {
		members: result.data || [],
		member
	};
};

const changeAuthorization = async (
	supabase: SupabaseClient,
	request: Request,
	authorized: boolean
) => {
	const formData = await request.formData();
	const id = Number(formData.get('id'));

	await updateMemberAuthorization(supabase, id, authorized);
};

export const actions = {
	authorize: async ({ locals: { supabase }, request }) => {
		await changeAuthorization(supabase, request, true);
	},
	unauthorize: async ({ locals: { supabase }, request }) => {
		await changeAuthorization(supabase, request, false);
	}
} satisfies Actions;
