import { getCurrentDate } from '$lib/logic/dates';
import type { PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type Event = UnwrapQuery<typeof fetchAllEvents>[number];

export type EventWithJoins = UnwrapQuery<typeof fetchAllEventsForCalendar>[number];

const fetchAllEvents = (supabase: SupabaseClient) =>
	supabase.from('event').select(`id, date, start, end, location`);

export const fetchEvents = (supabase: SupabaseClient, isFuture: boolean) =>
	fetchAllEvents(supabase)
		[isFuture ? 'gte' : 'lte']('date', getCurrentDate())
		.order('date', { ascending: isFuture });

const fetchAllEventsForCalendar = (supabase: SupabaseClient) =>
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

export const fetchEventsForCalendar = (supabase: SupabaseClient, isFuture: boolean) =>
	fetchAllEventsForCalendar(supabase)
		[isFuture ? 'gte' : 'lte']('date', getCurrentDate())
		.order('date', { ascending: isFuture });

export const fetchEventsForReminder = (supabase: SupabaseClient) =>
	fetchAllEventsForCalendar(supabase).eq('date', getCurrentDate()).single();

export const fetchEvent = (supabase: SupabaseClient, id: number) =>
	supabase.from('event').select(`id, date, start, end, location`).eq('id', id).single();

export const upsertEvent = (supabase: SupabaseClient, event: PartialSome<Event, 'id'>) =>
	supabase.from('event').upsert(event);
