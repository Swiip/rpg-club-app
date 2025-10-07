import type { SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type Member = UnwrapQuery<typeof fetchMembers>[number];

export type MemberView = { id: number; handle: string; discord_id: string; avatar: string | null };
export const memberView = '( id, handle, discord_id, avatar )' as const;

export const fetchMemberByDiscordId = (supabase: SupabaseClient, discordId: string) =>
	supabase
		.from('member')
		.select(`id, handle, avatar, authorized, discord_id`)
		.eq('discord_id', discordId)
		.single();

export const fetchMembers = (supabase: SupabaseClient) =>
	supabase
		.from('member')
		.select(`id, handle, avatar, authorized, discord_id`)
		.order('handle', { ascending: true });

export const updateMemberAuthorization = (
	supabase: SupabaseClient,
	memberId: number,
	authorized: boolean
) => supabase.from('member').update({ authorized }).eq('id', memberId).single();
