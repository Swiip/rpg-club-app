import type { PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type Game = UnwrapQuery<typeof fetchGames>[number];

export const fetchGames = (supabase: SupabaseClient) =>
	supabase
		.from('game')
		.select(`id, name, description,illustration`)
		.order('name', { ascending: true });

export const fetchGame = (supabase: SupabaseClient, id: number) =>
	supabase.from('game').select(`id, name, description, illustration`).eq('id', id).single();

export const upsertGame = (supabase: SupabaseClient, game: PartialSome<Game, 'id'>) =>
	supabase.from('game').upsert(game);
