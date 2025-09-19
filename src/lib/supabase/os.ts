import { formatDateInput } from '$lib/logic/dates';
import type { SupabaseClient, UnwrapQuery, Os, PartialSome } from '$lib/supabase/types';

export type OsWithJoins = UnwrapQuery<typeof fetchAllOses>[number];

const fetchAllOses = (supabase: SupabaseClient) =>
	supabase.from('os').select(
		`
			id, title, description,
			game ( id, name, illustration ),
			gm ( id, handle ),
			event ( id, date ),
			registration ( id, confirmation, member ( id, handle ) )
		`
	);

export const fetchOses = (supabase: SupabaseClient, isFuture: boolean) =>
	(isFuture
		? fetchAllOses(supabase).not('event', 'is', null).gte('event.date', formatDateInput())
		: fetchAllOses(supabase).lte('event.date', formatDateInput())
	).order('event ( date )', { ascending: isFuture });

export const fetchOs = (supabase: SupabaseClient, id: number) =>
	supabase.from('os').select(`id, title, description, game, gm, event`).eq('id', id).single();

export const upsertOs = (supabase: SupabaseClient, os: PartialSome<Os, 'id' | 'created_at'>) =>
	supabase.from('os').upsert(os);

export const deleteOs = (supabase: SupabaseClient, id: number) =>
	supabase.from('os').delete().eq('id', id);
