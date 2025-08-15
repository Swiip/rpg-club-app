import type { SupabaseClient } from '$lib/supabase/types';

export const downloadImage = async (supabase: SupabaseClient, bucket: string, path: string) => {
	try {
		if (path.startsWith('http')) {
			return path;
		}

		const { data, error } = await supabase.storage.from(bucket).download(path);

		if (error) {
			throw error;
		}

		return URL.createObjectURL(data);
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error downloading image', error.message);
		}
	}
};

export const uploadImage = async (supabase: SupabaseClient, bucket: string, file: File) => {
	try {
		const fileExt = file.name.split('.').pop();
		const filePath = `${Math.random()}.${fileExt}`;

		const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);

		if (error) {
			throw error;
		}

		return data?.path;
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error uploading image', error.message);
		}
	}
};
