import { getMention } from '$lib/discord/send';
import { computeCalendar } from '$lib/logic/calendar';
import { formatDate, formatMonth } from '$lib/logic/dates';
import { capitalize } from '$lib/logic/strings';
import { createPrivateClient } from '$lib/supabase/clients';
import { fetchEventsForCalendar } from '$lib/supabase/events';

export const createCalendarMessage = async () => {
	const supabase = createPrivateClient();

	const events = await fetchEventsForCalendar(supabase, true);

	if (!events.data) {
		return { content: "Rien en base données, ce n'est pas normal..." };
	}

	const mentionsBuilder = new Set<string>();
	const messageBuilder: string[] = [];

	const calendar = computeCalendar(events.data);

	calendar.months.slice(0, 2).forEach((month) => {
		messageBuilder.push(`__**${capitalize(formatMonth(month.name))}**__`, '');

		month.events.forEach((event) => {
			const date = `- **${capitalize(formatDate(event.date))} ${event.location}** :`;

			const lineBuilder: string[] = [];

			if (event.tables.length === 0) {
				lineBuilder.push('Aucune table de prévue pour le moment');
			} else {
				event.tables.forEach((table) => {
					if (table.type === 'os') {
						lineBuilder.push(`OS ${table.title} ${getMention(table.gm, mentionsBuilder)}`);
					}
					if (table.type === 'campaign') {
						lineBuilder.push(`${table.title} ${getMention(table.gm, mentionsBuilder)}`);
					}
				});
			}

			messageBuilder.push(`${date} ${lineBuilder.join(', ')}`);
		});

		messageBuilder.push('');
	});

	return {
		content: messageBuilder.join('\n'),
		allowed_mentions: { users: [...mentionsBuilder] }
	};
};
