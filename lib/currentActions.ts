import type { Json } from "../types/global";
import database from "./database";

async function save(data: Json = {}): Promise<string> {
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await database.saveAction(code, data);
    return code;
}

async function retrieve(code:string): Promise<Json | undefined> {
    return (await database.retrieveAction(code)).json;
}

async function check(code: string, data: Json): Promise<boolean> {
    const value = await retrieve(code);  
    
    return value && objectsEquals(value, data);
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
    check,
    retrieve,
}