import type { Event } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchEvents = async (supabase: SupabaseClient) =>
	supabase
		.from('event')
		.select(`id, date, start, end, location`)
		.order('date', { ascending: true });

export const fetchEvent = async (supabase: SupabaseClient, id: string) =>
	supabase.from('event').select(`id, date, start, end, location`).eq('id', id).single();

export const upsertEvent = async (
	supabase: SupabaseClient,
	event: Partial<Pick<Event, 'id'>> | Omit<Event, 'id'>
) => supabase.from('event').upsert(event);
