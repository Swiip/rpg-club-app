import type { Game } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchGames = async (supabase: SupabaseClient) =>
	supabase
		.from('game')
		.select(`id, name, description,illustration`)
		.order('name', { ascending: true });

export const fetchGame = async (supabase: SupabaseClient, id: string) =>
	supabase.from('game').select(`id, name, description, illustration`).eq('id', id).single();

export const upsertGame = async (
	supabase: SupabaseClient,
	game: Partial<Pick<Game, 'id'>> | Omit<Game, 'id'>
) => supabase.from('game').upsert(game);
