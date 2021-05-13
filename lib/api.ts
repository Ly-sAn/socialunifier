import { ApiResult, Json } from "../types/global"

export async function fetchApi(path: ApiRoute, method: 'POST' | 'GET', data: Json): Promise<ApiResult> {
    const res = await global.fetch(path, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method,
    })
    return await res.json()
}

export enum ApiRoute {
    Login = '/api/auth/login',
    Register = '/api/auth/register',
    Logout = '/api/auth/logout',
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