import type { SupabaseClient } from '$lib/supabase/types';

export type SessionAction = 'delete' | 'add';

export const createSession = (supabase: SupabaseClient, campaignId: number, eventId: number) =>
	supabase.from('session').insert({ campaign: campaignId, event: eventId });

export const deleteSession = (supabase: SupabaseClient, campaignId: number, eventId: number) =>
	supabase.from('session').delete().eq('campaign', campaignId).eq('event', eventId);
