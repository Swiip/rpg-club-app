export type Member = {
	id: string;
	handle: string;
	avatar: string;
	authorized: boolean;
};

export type Game = {
	id: string;
	name: string;
	description: string;
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
	description: string;
	game: string;
	gm: string;
	event: string;
};

export type Campaign = {
	id: string;
	title: string;
	game: string;
	gm: string;
};

export type Registration = {
	id: string;
	member: {
		id: string;
		handle: string;
	};
	os: string;
	campaign: string;
};
