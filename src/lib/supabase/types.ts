import type { CampaignWithJoins } from '$lib/supabase/campaigns';
import type { Database } from '$lib/supabase/database.types';
import type { OsWithJoins } from '$lib/supabase/os';
import type { SupabaseClient as GenericSupabaseClient } from '@supabase/supabase-js';

export type SupabaseClient = GenericSupabaseClient<Database>;

export type UnwrapQuery<T> = T extends (supabase: SupabaseClient) => PromiseLike<{ data: infer U }>
	? NonNullable<U>
	: never;

export type Game = Database['public']['Tables']['game']['Row'];
export type Event = Database['public']['Tables']['event']['Row'];
export type Member = Database['public']['Tables']['member']['Row'];
export type Registration = Database['public']['Tables']['registration']['Row'];
export type Os = Database['public']['Tables']['os']['Row'];
export type Campaign = Database['public']['Tables']['campaign']['Row'];

export type WithRegistration =
	| Pick<OsWithJoins, 'id' | 'registration'>
	| Pick<CampaignWithJoins, 'id' | 'registration'>;

export type RegistrationWithJoin = WithRegistration['registration'][number];

export type PartialSome<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
