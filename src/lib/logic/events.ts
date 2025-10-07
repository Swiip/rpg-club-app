import { computeWarnings, initWarnings, type Warnings } from '$lib/logic/warnings';
import type { EventWithJoins } from '$lib/supabase/events';
import type { MemberView } from '$lib/supabase/members';

export type EventOption = {
	id: number;
	date: string;
	location: string;
	warnings: Warnings;
};

export const computeEventOptions = (
	allEvents: EventWithJoins[],
	excludedEvents: { id: number }[],
	members: MemberView[]
): EventOption[] =>
	allEvents
		.filter((included) => !excludedEvents.find((excluded) => excluded.id === included.id))
		.map((event) => ({
			...event,
			warnings: computeWarnings(event, initWarnings({ members: new Set(members) }), true)
		}));
