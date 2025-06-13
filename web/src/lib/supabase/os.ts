import type { Os } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchOses = async (supabase: SupabaseClient) =>
	supabase
		.from('os')
		.select(
			`
			id, title,
			game ( id, name ),
			gm ( id, handle ),
			event ( id, date ),
			registration ( id, confirmation, member ( id, handle ) )
		`
		)
		.order('title', { ascending: true });

export const fetchOs = async (supabase: SupabaseClient, id: string) =>
	supabase.from('os').select(`id, title, game, gm, event`).eq('id', id).single();

export const upsertOs = async (
	supabase: SupabaseClient,
	os: Partial<Pick<Os, 'id'>> | Omit<Os, 'id'>
) => supabase.from('os').upsert(os);
