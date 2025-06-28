<script lang="ts">
	import RegistrationForm from './registration-form.svelte';

	type Props = {
		targetId: string;
		memberId: string;
	};

	const { targetId, memberId }: Props = $props();
</script>

<RegistrationForm {targetId} {memberId}>
	<button class="btn preset-tonal-primary" formaction="?/signup">Sign Up</button>
</RegistrationForm>
