export const formatDate = (date: string | Date | null | undefined) =>
	date
		? new Date(date).toLocaleString('fr-FR', {
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})
		: 'Date manquante';

export const formatTime = (time: string | Date | null | undefined) =>
	time
		? new Date(typeof time === 'string' ? `1-1-0-${time}` : time).toLocaleString('fr-FR', {
				hour: 'numeric',
				minute: 'numeric'
			})
		: 'Horaire manquant';

export const formatMonth = (time: string | Date | null | undefined) =>
	time
		? new Date(time).toLocaleString('fr-FR', { year: 'numeric', month: 'long' })
		: 'Mois manquant';

export const getCurrentDate = () => {
	const iso = new Date().toISOString();
	return iso.substring(0, iso.indexOf('T'));
};
