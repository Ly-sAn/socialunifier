import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { DbUser, SocialNetwork } from '../types/global';
import { modelDatabase } from './databaseModeler';

sqlite3.verbose()


const _db = open({
    filename: 'base.db',
    driver: sqlite3.Database
})

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
                        unique: true,
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
                        type: 'INTEGER'
                    },
                    {
                        name: 'RefreshToken',
                        type: 'TEXT'
                    }
                ]
            },
        ]
    }, opened)
})

type saveCredentialsParams = {
    socialNetwork: SocialNetwork,
    userId: number,
    token: string,
    expire?: Date,
    refreshToken?: string,
}

class database {

    async register({ email, pwdHash, userName }): Promise<number> {
        const db = await _db;
        await db.run('INSERT INTO User (Email, PasswordHash, UserName) VALUES ($email, $pwd, $userName);', { $email: email, $pwd: pwdHash, $userName: userName });
        const newUser = await db.get('SELECT Id FROM User WHERE Email = $email', { $email: email });
        return newUser.Id;
    }

    async getAccount(id: number): Promise<DbUser | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM User WHERE Id = $id', { $id: id });
    }

    async getAccountByEmail(email: string): Promise<DbUser | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM User WHERE Email = $email', { $email: email });
    }
    
    
    async saveCredentials({ socialNetwork, userId, token, expire, refreshToken }: saveCredentialsParams): Promise<void> {
        const db = await _db;
        await db.run('INSERT INTO Token (UserId, Network, Code, Expire, RefreshToken) VALUES ($userId, $network, $code, $expire, $refreshToken)',
            { $userId: userId, $network: socialNetwork, $code: token, $expire: expire, $refreshToken: refreshToken });
    }
}

export default new database()
