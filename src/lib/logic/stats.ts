import type { Member } from '$lib/logic/calendar';
import type { EventWithJoins } from '$lib/supabase/events';

type StatEntry = {
	member: Member;
	asGm: number;
	asPc: number;
	bg: number;
};

export const computeStats = (events: EventWithJoins[]) => {
	const stats: Record<string, StatEntry> = {};

	const getEntry = (member: Member) => {
		if (!stats[member.discord_id]) {
			stats[member.discord_id] = { member, asGm: 0, asPc: 0, bg: 0 };
		}

		return stats[member.discord_id];
	};

	events.forEach((event) => {
		event.os.forEach((os) => {
			if (os.game.name.toLowerCase() === 'jds') {
				[os.gm, ...os.registration.map((registration) => registration.member)].forEach((player) => {
					getEntry(player).bg++;
				});
			} else {
				getEntry(os.gm).asGm++;
				os.registration
					.filter((registration) => registration.confirmation)
					.forEach((registration) => getEntry(registration.member).asPc++);
			}
		});

		event.session.forEach((session) => {
			getEntry(session.campaign.gm).asGm++;
			session.campaign.registration
				.filter((registration) => registration.confirmation)
				.forEach((registration) => getEntry(registration.member).asPc++);
		});
	});

	return Object.values(stats).sort((a, b) => a.member.handle.localeCompare(b.member.handle));
};
