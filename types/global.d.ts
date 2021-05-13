import type { NextApiRequest, NextApiResponse } from 'next'

interface Json {
    [key: string]: string|number|boolean|Json|Array<Json>;
}

type SocialNetwork = 'Reddit'

interface ErrorApiResult extends Json {
    success: false,
    reason: enum
}
interface SuccessApiResult extends Json {
    success: true
}
type ApiResult = SuccessApiResult | ErrorApiResult

type SessionHandler = ((req: SessionRequest, res: NextApiResponse) => any)
    | ((a: SessionHandlerArgs) => any)

type SessionHandlerArgs = {req: SessionRequest, res: NextApiResponse}

interface SessionRequest extends NextApiRequest {
    session: {
        get: (name: string) => any,
        set: (name: string, value: any) => void,
        unset: (name: string) => void,
        save: () => Promise,
        destroy: () => Promise
    }
}

interface UserNotLoggedIn  {
    isLoggedIn: false
}
interface UserLoggedIn {
    isLoggedIn: true,
    email: string,
    userName: string,
}

type User = UserNotLoggedIn | UserLoggedIn
