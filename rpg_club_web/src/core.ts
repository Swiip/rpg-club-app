import initCore, { process_event, handle_response, view } from "rpg_club_core";
import type { Effect, Event, HttpResult } from "shared_types/types/shared_types";
import { EffectVariantRender, ViewModel, EffectVariantHttp, Request } from "shared_types/types/shared_types";
import { BincodeSerializer, BincodeDeserializer } from "shared_types/bincode/mod";

import { request as http } from "./http";
import { writable } from "svelte/store";

const { subscribe, set } = writable(new ViewModel([]));

export async function update(event: Event) {
    console.log("event", event);
    await initCore();

    const serializer = new BincodeSerializer();
    event.serialize(serializer);

    const effects = process_event(serializer.getBytes());
    const requests = deserializeRequests(effects);
    for (const { id, effect } of requests) {
        processEffect(id, effect);
    }
}

async function processEffect(id: number, effect: Effect) {
    console.log("effect", effect);
    switch (effect.constructor) {
        case EffectVariantRender: {
            set(deserializeView(view()));
            break;
        }
        case EffectVariantHttp: {
            const request = (effect as EffectVariantHttp).value;
            const result = await http(request);
            console.log("http", result);
            respond(id, result);
            break;
        }
    }
}

function deserializeRequests(bytes: Uint8Array): Request[] {
    const deserializer = new BincodeDeserializer(bytes);
    const len = deserializer.deserializeLen();
    const requests: Request[] = [];
    for (let i = 0; i < len; i++) {
        const request = Request.deserialize(deserializer);
        requests.push(request);
    }
    return requests;
}

function deserializeView(bytes: Uint8Array): ViewModel {
    return ViewModel.deserialize(new BincodeDeserializer(bytes));
}

function respond(id: number, response: HttpResult) {
    const serializer = new BincodeSerializer();
    response.serialize(serializer);

    const effects = handle_response(id, serializer.getBytes());

    const requests = deserializeRequests(effects);
    for (const { id, effect } of requests) {
        processEffect(id, effect);
    }
}

export default {
    subscribe,
};
