import type { PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type GameType = 'rpg' | 'bg';

export const getGameType = (type: number | undefined): GameType =>
	type === undefined || type === 0 ? 'rpg' : 'bg';
export const getGameTypeFlag = (type: GameType | undefined): number =>
	type === undefined || type === 'rpg' ? 0 : 1;

export type Game = UnwrapQuery<typeof fetchAllGames>[number];

export const fetchAllGames = (supabase: SupabaseClient) =>
	supabase
		.from('game')
		.select(`id, type, name, description, illustration`)
		.order('name', { ascending: true });

export const fetchGames = (supabase: SupabaseClient, type: GameType) =>
	fetchAllGames(supabase).eq('type', getGameTypeFlag(type));

export const fetchGame = (supabase: SupabaseClient, id: number) =>
	supabase.from('game').select(`id, type, name, description, illustration`).eq('id', id).single();

export const upsertGame = (supabase: SupabaseClient, game: PartialSome<Game, 'id'>) =>
	supabase.from('game').upsert(game);
