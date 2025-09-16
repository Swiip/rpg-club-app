import { availabilityCode } from '$lib/supabase/availabilities';
import type { EventWithJoins } from '$lib/supabase/events';

type OsEvent = EventWithJoins['os'][number];
type CampaignEvent = EventWithJoins['session'][number]['campaign'];
type Table = ({ type: 'os' } & OsEvent) | ({ type: 'campaign' } & CampaignEvent);
type Member = Table['registration'][number]['member'];

export type Event = {
	date: string;
	location: string;
	tables: Table[];
	duplicates: Member[];
	unavailabilities: { unset: Member[]; off: Member[]; maybe: Member[] };
};

type Month = {
	name: string;
	events: Event[];
};

type Calendar = {
	months: Month[];
};

export const computeCalendar = (events: EventWithJoins[]): Calendar => {
	const calendar: Calendar = { months: [] };

	events.forEach((eventData) => {
		const eventDate = new Date(eventData.date);
		const monthName = `${eventDate.getUTCFullYear()}-${(eventDate.getUTCMonth() + 1).toString().padStart(2, '0')}`;
		let month = calendar.months.find((month) => month.name === monthName);
		if (!month) {
			month = { name: monthName, events: [] };
			calendar.months.push(month);
		}

		let event = month.events.find((event) => event.date === eventData.date);
		if (!event) {
			event = {
				date: eventData.date,
				location: eventData.location,
				tables: [],
				duplicates: [],
				unavailabilities: { unset: [], off: [], maybe: [] }
			};
			month.events.push(event);
		}
		const members = new Set<Member>();

		if (eventData.os) {
			event.tables.push(...eventData.os.map((os) => ({ type: 'os' as const, ...os })));
		}
		if (eventData.session) {
			event.tables.push(
				...eventData.session.map((session) => ({ type: 'campaign' as const, ...session.campaign }))
			);
		}
		event.tables.forEach((table) =>
			table.registration.forEach(({ member }) =>
				members.values().find((m) => m.discord_id === member.discord_id)
					? event.duplicates.push(member)
					: members.add(member)
			)
		);
		members.forEach((member) => {
			const availability = eventData.availability.find(
				(availability) => availability.member.discord_id === member.discord_id
			)?.availability;

			if (availability === undefined) {
				event.unavailabilities.unset.push(member);
			}

			if (availability === availabilityCode.off) {
				event.unavailabilities.off.push(member);
			}

			if (availability === availabilityCode.maybe) {
				event.unavailabilities.maybe.push(member);
			}
		});
	});

	return calendar;
};
