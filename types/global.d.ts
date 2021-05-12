import  { NextApiRequest, NextApiResponse } from 'next'

interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray;
}
interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }

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

type DbUser = {
    Email: string,
    UserName: string
    PasswordHash: string
}