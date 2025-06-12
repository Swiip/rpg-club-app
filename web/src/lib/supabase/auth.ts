import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { fetchMemberByDiscordId } from './members';

export const authGuard = async (
	session: Session | null,
	supabase: SupabaseClient,
	redirect: (status: number, url: string) => Promise<Response>
) => {
	if (session === null) {
		throw redirect(303, '/auth');
	}

	let result = await fetchMemberByDiscordId(supabase, session.user.id);

	if (!result.data) {
		await supabase.from('member').insert({
			discord_id: session.user.id,
			handle:
				session.user.user_metadata.custom_claims.global_name ||
				session.user.user_metadata.full_name,
			avatar: session.user.user_metadata.avatar_url
		});

		result = await fetchMemberByDiscordId(supabase, session.user.id);
	}

	if (!result.data?.authorized) {
		throw redirect(303, '/auth/waiting');
	}

	return { member: result.data };
};
