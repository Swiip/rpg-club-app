import type { EventWithJoins } from '$lib/supabase/events';

type OsEvent = EventWithJoins['os'][number];
type CampaignEvent = EventWithJoins['session'][number]['campaign'];
type Table = ({ type: 'os' } & OsEvent) | ({ type: 'campaign' } & CampaignEvent);

export type Event = {
	date: string;
	location: string;
	tables: Table[];
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
			event = { date: eventData.date, location: eventData.location, tables: [] };
			month.events.push(event);
		}

		if (eventData.os) {
			event.tables.push(...eventData.os.map((os) => ({ type: 'os' as const, ...os })));
		}
		if (eventData.session) {
			event.tables.push(
				...eventData.session.map((session) => ({ type: 'campaign' as const, ...session.campaign }))
			);
		}
	});

	return calendar;
};
