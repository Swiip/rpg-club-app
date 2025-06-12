<script lang="ts">
	import { SiDiscord } from '@icons-pack/svelte-simple-icons';

	const { data } = $props();
	const { supabase } = data;

	const handleSignInWithDiscord = async () =>
		supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {
				redirectTo: location.origin + '/auth/callback'
			}
		});
</script>

<svelte:head>
	<title>RPG Club App - Login</title>
</svelte:head>

<div class="flex min-h-48 flex-col items-center justify-center">
	<button type="button" class="btn preset-filled-primary-500" onclick={handleSignInWithDiscord}>
		<span>Login with Discord</span>
		<SiDiscord size={18} />
	</button>
</div>
