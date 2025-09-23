import { announceOs } from '$lib/discord/messages/announceOs';
import { osThread } from '$lib/discord/messages/osThread';
import { editMessage, sendMessage } from '$lib/discord/send';
import { createPrivateClient } from '$lib/supabase/clients';
import { deleteOs, setMessage, upsertOs } from '$lib/supabase/os';
import { fail, redirect, type Action } from '@sveltejs/kit';

const announceOsToDiscord = async (
	isNew: boolean,
	id: number,
	messageId: string | null,
	threadId: string | null
) => {
	const threadMessage = await osThread(id);

	if (isNew) {
		const message = await announceOs(id);
		await sendMessage(message);
		const { id: messageId, channel_id: threadId } = await sendMessage(threadMessage);
		await setMessage(createPrivateClient(), id, messageId, threadId);
	} else if (messageId && threadId) {
		await editMessage(messageId, threadId, threadMessage);
	}
};

export const deleteAction: Action = async ({ locals: { supabase }, request }) => {
	const formData = await request.formData();
	const osId = Number(formData.get('osId'));

	return deleteOs(supabase, osId);
};

export const save: Action = async ({ locals: { supabase }, request, params }) => {
	const data = await request.formData();
	const title = String(data.get('title'));
	const description = String(data.get('description'));
	const game = Number(data.get('game'));
	const gm = Number(data.get('gm'));
	const event = Number(data.get('event'));

	const isNew = params.id === 'new';
	const id = isNew ? undefined : Number(params.id);

	const result = await upsertOs(supabase, { id, title, description, game, gm, event });

	if (result.error) {
		console.error('Error on saving', result.error.message);
		return fail(500, { error: result.error.message });
	}

	if (result.data) {
		const { id, message_id: messageId, thread_id: threadId } = result.data;
		await announceOsToDiscord(isNew, id, messageId, threadId);
	}

	redirect(303, '/os');
};
