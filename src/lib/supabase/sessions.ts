import type { SupabaseClient } from '@supabase/supabase-js';

export const createSession = async (
	supabase: SupabaseClient,
	campaignId: string,
	eventId: string
) => supabase.from('session').insert({ campaign: campaignId, event: eventId });

export const deleteSession = async (
	supabase: SupabaseClient,
	campaignId: string,
	eventId: string
) => supabase.from('session').delete().eq('campaign', campaignId).eq('event', eventId);
