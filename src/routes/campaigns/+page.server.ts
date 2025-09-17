import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authGuard } from '$lib/supabase/auth';
import { fetchCampaigns } from '$lib/supabase/campaigns';
import { fetchMembers } from '$lib/supabase/members';
import { session } from '$lib/actions/session';
import { registration } from '$lib/actions/registration';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	await authGuard(session, supabase, redirect);

	const campaignsResult = await fetchCampaigns(supabase);
	const membersResult = await fetchMembers(supabase);

	return {
		campaigns: campaignsResult.data || [],
		members: membersResult.data || []
	};
};

export const actions = { registration: registration('campaign'), session };
