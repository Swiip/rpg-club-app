export type Member = {
	id: string;
	handle: string;
	avatar: string;
	authorized: boolean;
};

export type Game = {
	id: string;
	name: string;
	illustration: string;
};

export type Event = {
	id: string;
	date: string;
	start: string;
	end: string;
	location: string;
};

export type Os = {
	id: string;
	title: string;
	game: string;
	gm: string;
	event: string;
};
