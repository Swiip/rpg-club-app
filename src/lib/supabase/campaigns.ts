import type { Campaign } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchCampaigns = async (supabase: SupabaseClient) =>
	supabase
		.from('campaign')
		.select(
			`
			id, title,
			game ( id, name ),
			gm ( id, handle ),
			session ( id, event ( id, date ) ),
			registration ( id, confirmation, member ( id, handle ) )
		`
		)
		.order('title', { ascending: true });

export const fetchCampaign = async (supabase: SupabaseClient, id: string) =>
	supabase.from('campaign').select(`id, title, game, gm`).eq('id', id).single();

export const upsertCampaign = async (
	supabase: SupabaseClient,
	os: Partial<Pick<Campaign, 'id'>> | Omit<Campaign, 'id'>
) => supabase.from('campaign').upsert(os);
