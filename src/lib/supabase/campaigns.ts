import type { Campaign, PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type CampaignWithJoins = UnwrapQuery<typeof fetchCampaigns>[number];

export const fetchCampaigns = (supabase: SupabaseClient) =>
	supabase
		.from('campaign')
		.select(
			`
			id, title, description,
			game ( id, name, illustration ),
			gm ( id, handle, discord_id ),
			session ( id, event ( id, date ) ),
			registration ( id, confirmation, member ( id, handle, discord_id ) )
		`
		)
		.order('title', { ascending: true });

export const fetchCampaignWithJoins = (supabase: SupabaseClient, id: number) =>
	fetchCampaigns(supabase).eq('id', id).single();

export const fetchCampaign = (supabase: SupabaseClient, id: number) =>
	supabase.from('campaign').select(`id, title, description, game, gm`).eq('id', id).single();

export const upsertCampaign = (
	supabase: SupabaseClient,
	campaign: PartialSome<Campaign, 'id' | 'created_at'>
) => supabase.from('campaign').upsert(campaign);
