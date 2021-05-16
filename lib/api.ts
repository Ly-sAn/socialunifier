import type { ApiResult, Json } from "../types/global"

export async function fetchApi(path: ApiRoute, method: 'POST' | 'GET', data: Json): Promise<ApiResult> {
    const res = await global.fetch(path, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method,
    })
    return await res.json()
}

// Permet de pouvoir renommé / déplacer une api facilement
export enum ApiRoute {
    Login = '/api/auth/login',
    Register = '/api/auth/register',
    Logout = '/api/auth/logout',
    User = '/api/auth/user',
    AuthorizeReddit = "/api/reddit/authorize",
    PostReddit = '/api/reddit/post',
    AuthorizeMastodon = "/api/mastodon/authorize",
    Post = '/api/post',
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

export enum PostError {
    UnknownError,
    NotLoggedIn,
    NoCredentials,
}
