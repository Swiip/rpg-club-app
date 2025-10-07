import { formatDateInput } from '$lib/logic/dates';
import { memberView } from '$lib/supabase/members';
import type { SupabaseClient, UnwrapQuery, PartialSome, Boardgame } from '$lib/supabase/types';

export type BoardgameWithJoins = UnwrapQuery<typeof fetchAllBoardgames>[number];

const fetchAllBoardgames = (supabase: SupabaseClient) =>
	supabase.from('boardgame').select(
		`
			id, description, message_id, thread_id,
			boardgame_games ( id, game ( id, name, illustration ) ),
			event ( id, date ),
			registration ( id, confirmation, member ${memberView} )
		`
	);

export const fetchBoardgames = (supabase: SupabaseClient, isFuture: boolean) =>
	(isFuture
		? fetchAllBoardgames(supabase).not('event', 'is', null).gte('event.date', formatDateInput())
		: fetchAllBoardgames(supabase).lte('event.date', formatDateInput())
	).order('event ( date )', { ascending: isFuture });

export const fetchBoardgame = (supabase: SupabaseClient, id: number) =>
	supabase.from('boardgame').select(`id, description, event`).eq('id', id).single();

export const fetchBoardgameDetails = (supabase: SupabaseClient, id: number) =>
	fetchAllBoardgames(supabase).eq('id', id).single();

export const upsertBoardgame = (
	supabase: SupabaseClient,
	boardgame: PartialSome<Boardgame, 'id' | 'created_at' | 'message_id' | 'thread_id'>
) => supabase.from('boardgame').upsert(boardgame).select(`id, message_id, thread_id`).single();

export const deleteBoardgame = (supabase: SupabaseClient, id: number) =>
	supabase.from('boardgame').delete().eq('id', id);

export const setMessage = (
	supabase: SupabaseClient,
	id: number,
	messageId: string,
	threadId: string
) => supabase.from('boardgame').update({ message_id: messageId, thread_id: threadId }).eq('id', id);
