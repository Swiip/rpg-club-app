import type { SupabaseClient, UnwrapQuery, Os, PartialSome } from '$lib/supabase/types';

export type OsWithJoins = UnwrapQuery<typeof fetchOses>[number];

export const fetchOses = (supabase: SupabaseClient) =>
	supabase
		.from('os')
		.select(
			`
			id, title, description,
			game ( id, name, illustration ),
			gm ( id, handle ),
			event ( id, date ),
			registration ( id, confirmation, member ( id, handle ) )
		`
		)
		.order('event ( date )', { ascending: true });

export const fetchOs = (supabase: SupabaseClient, id: number) =>
	supabase.from('os').select(`id, title, description, game, gm, event`).eq('id', id).single();

export const upsertOs = (supabase: SupabaseClient, os: PartialSome<Os, 'id' | 'created_at'>) =>
	supabase.from('os').upsert(os);
