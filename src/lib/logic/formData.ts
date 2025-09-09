export const parseId = (formData: FormData, field: string) => {
	const raw = formData.get(field);

	if (raw === null || raw.toString().trim() === '') {
		return undefined;
	}

	return Number(raw.toString());
};
