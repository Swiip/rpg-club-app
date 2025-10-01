import type { Member } from '$lib/logic/calendar';
import type { EventWithJoins } from '$lib/supabase/events';

export type Sort = 'member' | 'gm' | 'pc' | 'bg';
export type Dir = 'asc' | 'desc';

const fieldMap = {
	gm: 'asGm',
	pc: 'asPc',
	bg: 'bg'
} as const;

type StatEntry = {
	member: Member;
	asGm: number;
	asPc: number;
	bg: number;
};

export const computeStats = (events: EventWithJoins[], sort: Sort, dir: Dir) => {
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

	return Object.values(stats).sort((a, b) => {
		const dirModifier = dir === 'asc' ? 1 : -1;
		if (sort === 'member') {
			return a.member.handle.localeCompare(b.member.handle) * dirModifier;
		}
		const field = fieldMap[sort];
		return (a[field] - b[field]) * dirModifier;
	});
};
