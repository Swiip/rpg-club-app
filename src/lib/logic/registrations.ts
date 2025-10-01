import type { MemberView } from '$lib/supabase/members';
import type { WithRegistration } from '$lib/supabase/types';

const mapRegistrations = <T>(
	data: WithRegistration,
	callback: (registration: WithRegistration['registration'][number]) => T,

	confirmation = true
) =>
	data.registration
		.filter((registration) => registration.confirmation === confirmation)
		.map(callback);

const hasIntersection = (a: WithRegistration, b: WithRegistration) => {
	const aMembers = [a.gm, ...mapRegistrations(a, (r) => r.member)];
	const bMembers = [b.gm, ...mapRegistrations(b, (r) => r.member)];
	return aMembers.filter((a) => bMembers.find((b) => a.id === b.id));
};

export type RegistrionModel = {
	confirmed: MemberView[] | undefined;
	pending: MemberView[] | undefined;
};

export const computeRegistration = <T extends WithRegistration>(
	withRegistration: T
): RegistrionModel => ({
	confirmed: mapRegistrations(withRegistration, (r) => r.member),
	pending: mapRegistrations(withRegistration, (r) => r.member, false)
});

export type AntagonismModel<T extends WithRegistration> = {
	other: T;
	members: T['registration'][number]['member'][];
};

export const conputeAntagonisms = <T extends WithRegistration>(
	reference: T,
	all: T[]
): AntagonismModel<T>[] => {
	const antagonisms: AntagonismModel<T>[] = [];

	all.forEach((other) => {
		if (other.id !== reference.id) {
			const members = hasIntersection(reference, other);
			if (members.length > 0) {
				antagonisms.push({ other, members });
			}
		}
	});

	return antagonisms;
};
