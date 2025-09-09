import { availabilityCode, type AvailabilityStatus } from '$lib/supabase/availabilities';
import type { EventWithAvailabilities } from '$lib/supabase/events';

export const availabilityByCode = Object.fromEntries(
	Object.entries(availabilityCode).map(([key, value]) => [value, key])
) as Record<number, AvailabilityStatus>;

export const getStatus = (
	availabilities: EventWithAvailabilities['availability']
): AvailabilityStatus => {
	if (availabilities.length === 0) {
		return 'unset';
	}
	return availabilityByCode[availabilities[0].availability];
};
