import type { SupabaseClient } from '@supabase/supabase-js';

export const createRegistration = async (
	supabase: SupabaseClient,
	memberId: string,
	type: 'os' | 'campaign' | 'session',
	targetId: string
) =>
	supabase.from('registration').insert({ member: memberId, confirmation: false, [type]: targetId });

export const deleteRegistration = async (
	supabase: SupabaseClient,
	memberId: string,
	type: 'os' | 'campaign' | 'session',
	targetId: string
) => supabase.from('registration').delete().eq('member', memberId).eq(type, targetId);
