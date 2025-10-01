import { goto } from '$app/navigation';

export const gotoWithParams = (params: Record<string, string | undefined>) => {
	const searchParams = new URLSearchParams(location.search);

	Object.entries(params).forEach(([param, value]) => {
		if (value === undefined) {
			searchParams.delete(param);
		} else {
			searchParams.set(param, value);
		}
	});

	return searchParams.size === 0
		? goto(location.pathname)
		: goto(`${location.pathname}?${searchParams}`);
};

export const gotoWithParam = (param: string, value: string | undefined) =>
	gotoWithParams({ param: value });
