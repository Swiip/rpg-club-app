import type { Session } from '@supabase/supabase-js';
import { fetchMemberByDiscordId } from './members';
import type { SupabaseClient } from '$lib/supabase/types';

export const getDiscordData = (session: Session) => ({
	id: session.user.user_metadata.provider_id,
	handle:
		session.user.user_metadata.custom_claims.global_name || session.user.user_metadata.full_name,
	avatar: session.user.user_metadata.avatar_url
});

export const authGuard = async (
	session: Session | null,
	supabase: SupabaseClient,
	redirect: (status: number, url: string) => Promise<Response>
) => {
	if (session === null) {
		throw redirect(303, '/auth');
	}

	const discordData = getDiscordData(session);

	let result = await fetchMemberByDiscordId(supabase, discordData.id);

	if (!result.data) {
		await supabase.from('member').insert({
			discord_id: discordData.id,
			handle: discordData.handle,
			avatar: discordData.avatar
		});

		result = await fetchMemberByDiscordId(supabase, discordData.id);
	}

	if (!result.data?.authorized) {
		throw redirect(303, '/auth/waiting');
	}

	if (result.data.handle !== discordData.handle || result.data.avatar !== discordData.avatar) {
		await supabase
			.from('member')
			.update({
				discord_id: discordData.id,
				handle: discordData.handle,
				avatar: discordData.avatar
			})
			.eq('id', result.data.id);
	}

	return { member: result.data };
};
