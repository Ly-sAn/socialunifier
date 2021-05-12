import { ApiResult, Json } from "../types/global"

export async function fetchApi(path: string, method: 'POST' | 'GET', data: Json): Promise<ApiResult> {
    const res = await global.fetch(path, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method,
    })
    return await res.json()
}

export enum RegisterError {
    UnknownError,
    InvalidEmail,
    ExistingEmail,
}
  
export enum LoginError {
    UnknownError,
    InvalidLogins,
}