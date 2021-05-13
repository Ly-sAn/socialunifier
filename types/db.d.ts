import { SocialNetwork } from "./global"

type DbUser = {
    Id: number,
    Email: string,
    UserName: string
    PasswordHash: string
}

type DbToken = {
    UserId: number,
    Network: SocialNetwork,
    Code: string,
    Expire?: Date,
    RefreshToken?: string,
}