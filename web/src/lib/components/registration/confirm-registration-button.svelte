<script lang="ts">
	import RegistrationForm from './registration-form.svelte';

	type Props = {
		targetId: string;
		memberId: string;
		memberHandle: string;
	};

	const { targetId, memberId, memberHandle }: Props = $props();
</script>

<RegistrationForm {targetId} {memberId}>
	<button class="btn preset-tonal-primary" formaction="?/confirm">
		Confirm {memberHandle}
	</button>
</RegistrationForm>
