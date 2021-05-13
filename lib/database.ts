import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { DbUser } from '../types/global';
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
        ]
    }, opened)
})


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

    async getAccountByEmail({ email }): Promise<DbUser | undefined> {
        const db = await _db;
        return await db.get('SELECT * FROM User WHERE Email = $email', { $email: email });
    }
}

export default new database()
