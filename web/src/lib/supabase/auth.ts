import type { Session, SupabaseClient } from '@supabase/supabase-js';

const fetchMember = async (supabase: SupabaseClient, discordId: string) => {
	const result = await supabase
		.from('member')
		.select(`id, handle, avatar, authorized`)
		.eq('discord_id', discordId)
		.single();

	return result.data;
};

export const authGuard = async (
	session: Session | null,
	supabase: SupabaseClient,
	redirect: (status: number, url: string) => Promise<Response>
) => {
	if (session === null) {
		throw redirect(303, '/auth');
	}

	let member = await fetchMember(supabase, session.user.id);

	if (!member) {
		await supabase.from('member').insert({
			discord_id: session.user.id,
			handle:
				session.user.user_metadata.custom_claims.global_name ||
				session.user.user_metadata.full_name,
			avatar: session.user.user_metadata.avatar_url
		});

		member = await fetchMember(supabase, session.user.id);
	}

	if (!member?.authorized) {
		throw redirect(303, '/auth/waiting');
	}

	return { member };
};
