import { createClient } from '@supabase/supabase-js';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_KEY } from '$env/static/private';
import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '$lib/supabase/types';
import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';

export const createPrivateClient = (): SupabaseClient =>
	createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_KEY);

export const createAnonClient = (event: RequestEvent): SupabaseClient =>
	createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
