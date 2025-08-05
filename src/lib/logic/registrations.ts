import type { Member } from '$lib/types';

export type RegistrionModel = {
	// role: 'gm' | 'registered' | 'none';
	confirmed: string | undefined;
	pending: string | undefined;
};

export type WithRegistration = {
	id: string;
	gm: { id: string };
	registration: {
		id: string;
		confirmation: boolean;
		member: { id: string; handle: string };
	}[];
};

const computeRole = (withRegistration: WithRegistration, member: Member) => {
	if (withRegistration.gm.id === member.id) {
		return 'gm';
	}
	return withRegistration.registration.find(
		(withRegistration) => withRegistration.member.id === member.id
	)
		? 'registered'
		: 'none';
};

export const computeRegistrations = (
	withRegistrations: WithRegistration[] = []
): Record<string, RegistrionModel> => {
	const registrations: Record<string, RegistrionModel> = {};

	if (!withRegistrations) {
		return registrations;
	}

	withRegistrations.forEach((r) => {
		// const role = computeRole(r, member);
		const confirmed = r.registration
			.filter((r) => r.confirmation)
			.map((r) => r.member.handle)
			.join(', ');
		const pending = r.registration
			.filter((r) => !r.confirmation)
			.map((r) => r.member.handle)
			.join(', ');

		registrations[r.id] = { confirmed, pending };
	});

	return registrations;
};
