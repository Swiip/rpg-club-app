import { formatDateInput } from '$lib/logic/dates';
import { memberView } from '$lib/supabase/members';
import type { SupabaseClient, UnwrapQuery, Os, PartialSome } from '$lib/supabase/types';

export type OsWithJoins = UnwrapQuery<typeof fetchAllOses>[number];

const fetchAllOses = (supabase: SupabaseClient) =>
	supabase.from('os').select(
		`
			id, title, description, message_id, thread_id,
			game ( id, name, illustration ),
			gm ${memberView},
			event ( id, date ),
			registration ( id, confirmation, member ${memberView} )
		`
	);

export const fetchOses = (supabase: SupabaseClient, isFuture: boolean) =>
	(isFuture
		? fetchAllOses(supabase).not('event', 'is', null).gte('event.date', formatDateInput())
		: fetchAllOses(supabase).lte('event.date', formatDateInput())
	).order('event ( date )', { ascending: isFuture });

export const fetchOs = (supabase: SupabaseClient, id: number) =>
	supabase.from('os').select(`id, title, description, game, gm, event`).eq('id', id).single();

export const fetchOsDetails = (supabase: SupabaseClient, id: number) =>
	fetchAllOses(supabase).eq('id', id).single();

export const upsertOs = (
	supabase: SupabaseClient,
	os: PartialSome<Os, 'id' | 'created_at' | 'message_id' | 'thread_id'>
) => supabase.from('os').upsert(os).select(`id, message_id, thread_id`).single();

export const deleteOs = (supabase: SupabaseClient, id: number) =>
	supabase.from('os').delete().eq('id', id);

export const setMessage = (
	supabase: SupabaseClient,
	id: number,
	messageId: string,
	threadId: string
) => supabase.from('os').update({ message_id: messageId, thread_id: threadId }).eq('id', id);
