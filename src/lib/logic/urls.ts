import { goto } from '$app/navigation';

export const gotoWithParam = (param: string, value: string | undefined) => {
	const searchParams = new URLSearchParams(location.search);
	if (value === undefined) {
		searchParams.delete(param);
	} else {
		searchParams.set(param, value);
	}

	return searchParams.size === 0
		? goto(location.pathname)
		: goto(`${location.pathname}?${searchParams}`);
};
