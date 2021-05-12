import sqlite3 from 'sqlite3';
import { DbUser } from '../types/global';
import { modelDatabase } from './databaseModeler';
const sqlite = sqlite3.verbose();

const db = new sqlite.Database('base.db');

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
}, db)


export default class database {

    static register({ email, pwdHash, userName }) {
        return new Promise<void>((resolve, reject) => {
            db.run('INSERT INTO User (Email, PasswordHash, UserName) VALUES ($email, $pwd, $userName)', { $email: email, $pwd: pwdHash, $userName: userName }, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        })
    }

    static getAccount({ email }) {
        return new Promise<DbUser | undefined>((resolve, reject) => {
            db.get('SELECT * FROM User WHERE Email = $email', { $email: email }, (err, row) => {
                if (err)
                    reject(err)
                else
                    resolve(row)
            })
        })
    }
}