export type RegistrionModel = {
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

export const computeRegistrations = (
	withRegistrations: WithRegistration[] = []
): Record<string, RegistrionModel> => {
	const registrations: Record<string, RegistrionModel> = {};

	if (!withRegistrations) {
		return registrations;
	}

	withRegistrations.forEach((r) => {
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
