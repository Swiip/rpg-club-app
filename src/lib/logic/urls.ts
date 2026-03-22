import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
export const gotoWithParams = (params: Record<string, string | undefined>) => {
	const searchParams = new URLSearchParams(location.search);

	Object.entries(params).forEach(([param, value]) => {
		if (value === undefined) {
			searchParams.delete(param);
		} else {
			searchParams.set(param, value);
		}
	});

	const path = searchParams.size === 0 ? location.pathname : `${location.pathname}?${searchParams}`;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return goto(resolve(path as any));
};

export const gotoWithParam = (param: string, value: string | undefined) =>
	gotoWithParams({ param: value });
