import type { WithRegistration } from '$lib/supabase/types';

export type RegistrionModel = {
	confirmed: string | undefined;
	pending: string | undefined;
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
