<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import SupabaseImage from './supabase-image.svelte';
	import { uploadImage } from '$lib/supabase/image';

	type Props = {
		supabase: SupabaseClient;
		bucket: string;
		onChange?: (url: string | undefined) => void;
		url: string | undefined;
		className: string;
	};

	let { supabase, bucket, onChange, url, className }: Props = $props();

	let uploading = $state(false);
	let files = $state<FileList>();

	const handleUpload = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const path = await uploadImage(supabase, bucket, files[0]);

			url = path;
			onChange?.(path);
		} finally {
			uploading = false;
		}
	};
</script>

<div>
	<SupabaseImage {supabase} {bucket} {url} {className} />

	<label class="button primary block" for="illustration">
		{uploading ? 'Uploading ...' : 'Upload'}
	</label>
	<input
		style="visibility: hidden; position:absolute;"
		type="file"
		id="illustration"
		accept="image/*"
		bind:files
		onchange={handleUpload}
		disabled={uploading}
	/>
	<input type="hidden" name="illustration" value={url} />
</div>
