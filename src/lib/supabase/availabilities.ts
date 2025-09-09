import type { SupabaseClient } from '$lib/supabase/types';

export type AvailabilityStatus = 'unset' | 'off' | 'maybe' | 'on';

export const availabilityCode = { off: 0, maybe: 1, on: 2 };

export const updateAvailability = (
	supabase: SupabaseClient,
	availabilityId: number | undefined,
	status: AvailabilityStatus,
	event: number,
	member: number
) => {
	if (status === 'unset') {
		if (!availabilityId) {
			return;
		}
		return supabase.from('availability').delete().eq('id', availabilityId);
	}

	return supabase
		.from('availability')
		.upsert({ id: availabilityId, member, event, availability: availabilityCode[status] });
};
