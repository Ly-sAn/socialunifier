import type { NextApiRequest, NextApiResponse } from 'next'

type Json = string | number | boolean | Json | Json[] | {
    [key: string]: Json;
}

type SocialNetwork = 'Reddit' | 'Mastodon' | 'Tumblr'

interface ErrorApiResult extends Json {
    success: false,
    reason: enum
    [key: string]: Json;
}
interface SuccessApiResult extends Json {
    success: true
    [key: string]: Json;
}
type ApiResult = SuccessApiResult | ErrorApiResult

type SessionHandler = ((req: SessionRequest, res: NextApiResponse) => any)
    | ((a: SessionHandlerArgs) => any)

type SessionHandlerArgs = { req: SessionRequest, res: NextApiResponse }

interface SessionRequest extends NextApiRequest {
    session: {
        get: (name: string) => any,
        set: (name: string, value: any) => void,
        unset: (name: string) => void,
        save: () => Promise,
        destroy: () => Promise
    }
}

interface UserNotLoggedIn {
    isLoggedIn: false
}
interface UserLoggedIn {
    isLoggedIn: true,
    email: string,
    userName: string,
    networks: Array<SocialNetwork>,
}

type User = UserNotLoggedIn | UserLoggedIn

type Media = {
    mimeType: string,
    buffer: Buffer,
    fileName: string,
}
