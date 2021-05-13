import cache from 'memory-cache'
import type { SocialNetwork } from "../types/global";

console.log("hi");
cache.debug(true)

function save(state: string, userId: number, network: SocialNetwork) {
    cache.put(state, { userId, network }, 3600);
    console.log("saving", cache.keys());
    
}

function retrieve(state: string, userId: number, network: SocialNetwork) {
    console.log("retrieve", cache.keys());
    const value = cache.get(state);
    cache.del(state);
    
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