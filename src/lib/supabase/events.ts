import { getCurrentDate } from '$lib/logic/dates';
import type { PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type Event = UnwrapQuery<typeof fetchEvents>[number];

export type EventWithJoins = UnwrapQuery<typeof fetchEventsForCalendar>[number];

export const fetchEvents = (supabase: SupabaseClient) =>
	supabase
		.from('event')
		.select(`id, date, start, end, location`)
		.order('date', { ascending: true });

export const fetchEventsForCalendar = (supabase: SupabaseClient) =>
	supabase
		.from('event')
		.select(
			`
			id, date, start, end, location,
			os (
				id, title, game ( name, illustration ),
				gm ( handle, discord_id ),
				registration ( confirmation, member ( handle, discord_id ) )
			),
			session (
				id,
				campaign (
					id, title,
					game ( name, illustration ),
					gm ( handle, discord_id ),
					registration ( confirmation, member ( handle, discord_id ) )
				)
			)
		`
		)
		.order('date', { ascending: true });

export const fetchEventsForReminder = (supabase: SupabaseClient) =>
	fetchEventsForCalendar(supabase).eq('date', getCurrentDate()).single();

export const fetchEvent = (supabase: SupabaseClient, id: number) =>
	supabase.from('event').select(`id, date, start, end, location`).eq('id', id).single();

export const upsertEvent = (supabase: SupabaseClient, event: PartialSome<Event, 'id'>) =>
	supabase.from('event').upsert(event);
