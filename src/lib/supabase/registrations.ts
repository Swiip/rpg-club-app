import type { SupabaseClient } from '$lib/supabase/types';

export type RegistrationAction = 'confirm' | 'unconfirm' | 'delete' | 'add';

export const updateRegistration = (
	supabase: SupabaseClient,
	action: RegistrationAction,
	memberId: number,
	type: 'os' | 'campaign',
	targetId: number
) => {
	if (action === 'add')
		return supabase
			.from('registration')
			.insert({ member: memberId, confirmation: false, [type]: targetId });

	return (
		action === 'delete'
			? supabase.from('registration').delete()
			: supabase.from('registration').update({ confirmation: action === 'confirm' })
	)
		.eq('member', memberId)
		.eq(type, targetId);
};
