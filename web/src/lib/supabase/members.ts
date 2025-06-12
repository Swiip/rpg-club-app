import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchMemberByDiscordId = async (supabase: SupabaseClient, discordId: string) =>
	supabase
		.from('member')
		.select(`id, handle, avatar, authorized`)
		.eq('discord_id', discordId)
		.single();

export const fetchMembers = async (supabase: SupabaseClient) =>
	supabase
		.from('member')
		.select(`id, handle, avatar, authorized`)
		.order('handle', { ascending: true });

export const updateMemberAuthorization = async (
	supabase: SupabaseClient,
	memberId: string,
	authorized: boolean
) => supabase.from('member').update({ authorized }).eq('id', memberId).single();
