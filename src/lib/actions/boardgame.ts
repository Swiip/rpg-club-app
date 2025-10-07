import { announceBg } from '$lib/discord/messages/announceBg';
import { bgThread } from '$lib/discord/messages/bgThread';
import { editMessage, sendMessage } from '$lib/discord/send';
import { deleteBoardgame, upsertBoardgame } from '$lib/supabase/boardgames';
import { setMessage } from '$lib/supabase/boardgames';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fail, redirect, type Action } from '@sveltejs/kit';

const announceBoardgameToDiscord = async (
	supabase: SupabaseClient,
	isNew: boolean,
	id: number,
	messageId: string | null,
	threadId: string | null
) => {
	const threadMessage = await bgThread(supabase, id);

	if (isNew) {
		const message = await announceBg(supabase, id);
		await sendMessage(message);
		const { id: messageId, channel_id: threadId } = await sendMessage(threadMessage);
		await setMessage(supabase, id, messageId, threadId);
	} else if (messageId && threadId) {
		await editMessage(messageId, threadId, threadMessage);
	}
};

export const deleteAction: Action = async ({ locals: { supabase }, request }) => {
	const formData = await request.formData();
	const osId = Number(formData.get('boardgameId'));

	return deleteBoardgame(supabase, osId);
};

export const save: Action = async ({ locals: { supabase }, request, params }) => {
	const data = await request.formData();
	const description = String(data.get('description'));
	const event = Number(data.get('event'));

	const isNew = params.id === 'new';
	const id = isNew ? undefined : Number(params.id);

	const result = await upsertBoardgame(supabase, { id, description, event });

	if (result.error) {
		console.error('Error on saving', result.error.message);
		return fail(500, { error: result.error.message });
	}

	if (result.data) {
		const { id, message_id: messageId, thread_id: threadId } = result.data;
		await announceBoardgameToDiscord(supabase, isNew, id, messageId, threadId);
	}

	redirect(303, '/boardgames');
};

export const games: Action = async ({ locals: { supabase }, request }) => {
	const formData = await request.formData();
	const targetId = Number(formData.get('targetId'));
	const gameId = Number(formData.get('gameId'));
	const action = formData.get('action') as 'add' | 'delete';

	if (action === 'add')
		return supabase.from('boardgame_games').insert({ boardgame: targetId, game: gameId });

	if (action === 'delete')
		return supabase.from('boardgame_games').delete().eq('boardgame', targetId).eq('game', gameId);
};
