import { formatDateInput } from '$lib/logic/dates';
import { memberView } from '$lib/supabase/members';
import type { PartialSome, SupabaseClient, UnwrapQuery } from '$lib/supabase/types';

export type Event = UnwrapQuery<typeof fetchEventsBase>[number];

export type EventWithJoins = UnwrapQuery<typeof fetchAllEventsForCalendar>[number];

export type EventWithAvailabilities = UnwrapQuery<typeof fetchAllEventsForAvailabilities>[number];

const fetchEventsBase = (supabase: SupabaseClient) =>
	supabase.from('event').select(`id, date, start, end, location`);

export const fetchEvents = (supabase: SupabaseClient, isFuture: boolean) =>
	fetchEventsBase(supabase)
		[isFuture ? 'gte' : 'lte']('date', formatDateInput())
		.order('date', { ascending: isFuture });

export const fetchAllEvents = (supabase: SupabaseClient) =>
	fetchEventsBase(supabase).order('date', { ascending: false });

const fetchAllEventsForCalendar = (supabase: SupabaseClient) =>
	supabase
		.from('event')
		.select(
			`
			id, date, start, end, location,
			os (
				id, title, game ( name, illustration ),
			gm ${memberView},
				registration ( confirmation, member ${memberView} )
			),
			session (
				id,
				campaign (
					id, title,
					game ( name, illustration ),
					gm ${memberView},
					registration ( confirmation, member ${memberView} )
				)
			),
			availability ( availability, member ${memberView} )
		`
		)
		.order('date', { ascending: true });

export const fetchEventsForCalendar = (supabase: SupabaseClient, isFuture: boolean) =>
	fetchAllEventsForCalendar(supabase)
		[isFuture ? 'gte' : 'lte']('date', formatDateInput())
		.order('date', { ascending: isFuture });

export const fetchEventsForReminder = (supabase: SupabaseClient) =>
	fetchAllEventsForCalendar(supabase).eq('date', formatDateInput());

export const fetchEventsForStats = (supabase: SupabaseClient, start: string, end: string) =>
	fetchAllEventsForCalendar(supabase).gte('date', start).lte('date', end);

export const fetchEvent = (supabase: SupabaseClient, id: number) =>
	supabase.from('event').select(`id, date, start, end, location`).eq('id', id).single();

export const upsertEvent = (supabase: SupabaseClient, event: PartialSome<Event, 'id'>) =>
	supabase.from('event').upsert(event);

const fetchAllEventsForAvailabilities = (supabase: SupabaseClient) =>
	supabase
		.from('event')
		.select(
			`
			id, date, location,
			availability ( id, availability, member )
		`
		)
		.order('date', { ascending: true });

export const fetchEventsForAvailabilities = (
	supabase: SupabaseClient,
	memberId: number,
	isFuture: boolean
) =>
	fetchAllEventsForAvailabilities(supabase)
		.eq('availability.member', memberId)
		[isFuture ? 'gte' : 'lte']('date', formatDateInput())
		.order('date', { ascending: isFuture });
