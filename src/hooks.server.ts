import { createAnonClient } from '$lib/supabase/clients';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createAnonClient(event);
	event.locals.supabase = supabase;

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		// Silent getSession warning until better solution
		const warn = console.warn;
		try {
			console.warn = () => {};
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) {
				return { session: null, user: null };
			}

			const {
				data: { user },
				error
			} = await supabase.auth.getUser();

			if (error) {
				// JWT validation has failed
				return { session: null, user: null };
			}

			return { session, user };
		} finally {
			console.warn = warn;
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
