import type { EventWithJoins } from '$lib/supabase/events';
import { availabilityCode } from '$lib/supabase/availabilities';
import type { MemberView } from '$lib/supabase/members';

export type Warnings = {
	members: Set<MemberView>;
	duplicates: Set<MemberView>;
	unavailabilities: { unset: Set<MemberView>; off: Set<MemberView>; maybe: Set<MemberView> };
};

export const initWarnings = (input: Partial<Warnings> = {}): Warnings => ({
	members: new Set(),
	duplicates: new Set(),
	unavailabilities: { unset: new Set(), off: new Set(), maybe: new Set() },
	...input
});

export const computeWarnings = (
	event: EventWithJoins,
	warnings: Warnings,
	lockMembers = false
): Warnings => {
	const { members, duplicates, unavailabilities } = warnings;
	const tables = [...event.os, ...event.session.map(({ campaign }) => campaign)];

	tables.forEach((table) =>
		table.registration.forEach(({ member }) =>
			members.values().find((m) => m.discord_id === member.discord_id)
				? duplicates.add(member)
				: !lockMembers && members.add(member)
		)
	);

	members.forEach((member) => {
		const availability = event.availability.find(
			(availability) => availability.member.discord_id === member.discord_id
		)?.availability;

		if (availability === undefined) {
			unavailabilities.unset.add(member);
		}

		if (availability === availabilityCode.off) {
			unavailabilities.off.add(member);
		}

		if (availability === availabilityCode.maybe) {
			unavailabilities.maybe.add(member);
		}
	});

	return warnings;
};

export const getWarningFlags = (warnings: Warnings) => {
	const hasDuplicates = warnings.duplicates.size > 0;
	const hasOffs = warnings.unavailabilities.off.size > 0;
	const hasMaybes = warnings.unavailabilities.maybe.size > 0;
	const hasUnsets = warnings.unavailabilities.unset.size > 0;
	const hasWarnings = hasDuplicates || hasOffs || hasMaybes || hasUnsets;
	return { hasDuplicates, hasOffs, hasMaybes, hasUnsets, hasWarnings };
};
