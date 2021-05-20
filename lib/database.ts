import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { modelDatabase } from "./databaseModeler";
import type { Json, SocialNetwork } from "../types/global";
import type { DbUser, DbToken, DbAction } from "../types/db";

sqlite3.verbose();

const _db = open({
    filename: 'base.db',
    driver: sqlite3.Database
});

_db.then(opened => {
    modelDatabase({
        tables: [
            {
                name: 'User',
                columns: [
                    {
                        name: 'Id',
                        type: 'INTEGER',
                        notNull: true,
                        unique: true,
                        primary: true,
                        autoIncrement: true,
                    },
                    {
                        name: 'Email',
                        type: 'TEXT',
                        notNull: true,
                        unique: true,
                    },
                    {
                        name: 'UserName',
                        type: 'TEXT',
                        notNull: true,
                    },
                    {
                        name: 'PasswordHash',
                        type: 'TEXT',
                        notNull: true,
                    },
                ]
            },
            {
                name: 'Token',
                columns: [
                    {
                        name: 'UserId',
                        type: 'INTEGER',
                        notNull: true,
                        primary: true,
                        foreignKey: {
                            table: 'User',
                            column: 'Id'
                        },
                    },
                    {
                        name: 'Network',
                        type: 'TEXT',
                        notNull: true,
                        primary: true,
                    },
                    {
                        name: 'Code',
                        type: 'TEXT',
                        notNull: true,
                    },
                    {
                        name: 'Expire',
                        type: 'INTEGER',
                    },
                    {
                        name: 'RefreshToken',
                        type: 'TEXT',
                    },
                    {
                        name: 'Secret',
                        type: 'TEXT',
                    },
                ]
            },
            {
                name: 'Action',
                columns: [
                    {
                        name: 'Code',
                        primary: true,
                        type: 'TEXT',
                        unique: true,
                        notNull: true,
                    },
                    {
                        name: 'Json',
                        notNull: true,
                        type: 'TEXT',
                        default: '{}',
                    }
                ]
            },
        ]
    }, opened)
});

type saveCredentialsParams = {
    socialNetwork: SocialNetwork,
    userId: number,
    token: string,
    expire?: Date,
    refreshToken?: string,
    tokenSecret?: string,
}

export default class database {

    static async register({ email, pwdHash, userName }): Promise<number> {
        const db = await _db;
        await db.run('INSERT INTO User (Email, PasswordHash, UserName) VALUES ($email, $pwd, $userName);', { $email: email, $pwd: pwdHash, $userName: userName });
        const newUser = await db.get('SELECT Id FROM User WHERE Email = $email', { $email: email });
        return newUser.Id;
    }

    static async updateUser({email, pwHash, userName, id}) {
        const db = await _db;
        await db.run('UPDATE User SET Email = $email, PasswordHash = $password, UserName = $userName WHERE id = $id;', {$email: email, $password: pwHash, $userName: userName, $id: id});
        const newCredentials = await db.get('SELECT Id FROM User WHERE Id = $id', {$id: id});
        return newCredentials.Id;
    }

    static async getAccount(id: number): Promise<DbUser | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM User WHERE Id = $id', { $id: id });
    }

    static async getAccountByEmail(email: string): Promise<DbUser | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM User WHERE Email = $email', { $email: email });
    }


    static async saveToken({ socialNetwork, userId, token, expire, refreshToken, tokenSecret }: saveCredentialsParams): Promise<void> {
        const db = await _db;
        await db.run('INSERT OR REPLACE INTO Token (UserId, Network, Code, Expire, RefreshToken, Secret) VALUES ($userId, $network, $code, $expire, $refreshToken, $secret)',
            { $userId: userId, $network: socialNetwork, $code: token, $expire: expire, $refreshToken: refreshToken, $secret: tokenSecret });
    }

    static async getToken(userId: number, socialNetwork: SocialNetwork): Promise<DbToken | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM Token WHERE UserId = $userId AND Network = $network', { $userId: userId, $network: socialNetwork });
    }

    static async getAllTokensForUser(userId: number): Promise<Array<DbToken>> {
        const db = await _db;
        return await db.all('SELECT * FROM Token WHERE UserId = $userId', { $userId: userId });
    }

    static async saveAction(code: string, json: Json): Promise<void> {
        const db = await _db;
        await db.run('INSERT INTO Action (Code, Json) VALUES ($code, $json)', { $code: code, $json: JSON.stringify(json) });
    }

    static async retrieveAction(code: string): Promise<DbAction | undefined> {
        const db = await _db;
        const result = await db.get('SELECT * FROM Action WHERE Code = $code', { $code: code });
        await db.run('DELETE FROM Action WHERE Code = $code', { $code: code });
        return result ? {
            code: result.Code,
            json: JSON.parse(result.Json)
        } : undefined;
    }
}

