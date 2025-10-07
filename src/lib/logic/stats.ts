import type { EventWithJoins } from '$lib/supabase/events';
import type { MemberView } from '$lib/supabase/members';

export type Sort =
	| 'member'
	| 'all'
	| 'gm'
	| 'gm.os'
	| 'gm.campaign'
	| 'gm.campaignIds'
	| 'pc'
	| 'pc.os'
	| 'pc.campaign'
	| 'pc.campaignIds'
	| 'bg';
export type Dir = 'asc' | 'desc';

type Role = { os: number; campaign: number; campaignIds: Set<number> };

type StatEntry = {
	member: MemberView;
	asGm: Role;
	asPc: Role;
	bg: number;
};

export const computeStats = (events: EventWithJoins[], sort: Sort, dir: Dir) => {
	const stats: Record<string, StatEntry> = {};

	const getEntry = (member: MemberView) => {
		if (!stats[member.discord_id]) {
			stats[member.discord_id] = {
				member,
				asGm: { os: 0, campaign: 0, campaignIds: new Set<number>() },
				asPc: { os: 0, campaign: 0, campaignIds: new Set<number>() },
				bg: 0
			};
		}

		return stats[member.discord_id];
	};

	const incRole = (
		member: MemberView,
		roleType: 'gm' | 'pc',
		tableType: 'os' | 'campaign',
		id: number
	) => {
		const role = getEntry(member)[roleType === 'gm' ? 'asGm' : 'asPc'];
		if (tableType === 'os') {
			role.os++;
		} else {
			role.campaign++;
			role.campaignIds.add(id);
		}
	};

	events.forEach((event) => {
		event.os.forEach((os) => {
			incRole(os.gm, 'gm', 'os', os.id);
			os.registration
				.filter((registration) => registration.confirmation)
				.forEach((registration) => incRole(registration.member, 'pc', 'os', os.id));
		});

		event.session.forEach((session) => {
			incRole(session.campaign.gm, 'gm', 'campaign', session.campaign.id);
			session.campaign.registration
				.filter((registration) => registration.confirmation)
				.forEach((registration) =>
					incRole(registration.member, 'pc', 'campaign', session.campaign.id)
				);
		});

		event.boardgame.forEach((boardgame) => {
			boardgame.registration
				.map((registration) => registration.member)
				.forEach((player) => getEntry(player).bg++);
		});
	});

	const getSortValue = (entry: StatEntry, sort: Omit<Sort, 'member'>): number => {
		switch (sort) {
			case 'all':
				return entry.asGm.os + entry.asGm.campaign + entry.asPc.os + entry.asPc.campaign + entry.bg;
			case 'gm':
				return entry.asGm.os + entry.asGm.campaign;
			case 'gm.os':
				return entry.asGm.os;
			case 'gm.campaign':
				return entry.asGm.campaign;
			case 'gm.campaignIds':
				return entry.asGm.campaignIds.size;
			case 'pc':
				return entry.asPc.os + entry.asPc.campaign;
			case 'pc.os':
				return entry.asPc.os;
			case 'pc.campaign':
				return entry.asPc.campaign;
			case 'pc.campaignIds':
				return entry.asPc.campaignIds.size;
			case 'bg':
				return entry.bg;
			default:
				return 0;
		}
	};

	return Object.values(stats).sort((a, b) => {
		const dirModifier = dir === 'asc' ? 1 : -1;
		if (sort === 'member') {
			return a.member.handle.localeCompare(b.member.handle) * dirModifier;
		}
		return (getSortValue(a, sort) - getSortValue(b, sort)) * dirModifier;
	});
};
