export const formatDate = (date: string | Date | null | undefined) =>
	date
		? new Date(date).toLocaleString(navigator.language, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})
		: 'Date manquante';
