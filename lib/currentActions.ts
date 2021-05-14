import type { SocialNetwork } from "../types/global";
import database from "./database";

function save(state: string, userId: number, network: SocialNetwork) {
    return database.saveAction(state, { userId, network });
}

async function retrieve(state: string, userId: number, network: SocialNetwork) {
    const value = await database.retrieveAction(state);
    
    return value && objectsEquals(value, { userId, network });
}

function objectsEquals(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}

export default {
    save,
    retrieve,
}