import sqlite3 from 'sqlite3';
import { DbUser } from '../types/gobal';
const sqlite = sqlite3.verbose();

const db = new sqlite.Database('base.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS "User" (
            "Id"	INTEGER NOT NULL UNIQUE,
            "Email"	TEXT NOT NULL UNIQUE,
            "PasswordHash"	TEXT NOT NULL,
            PRIMARY KEY("Id" AUTOINCREMENT)
        );
    `);
});


export default class database {

    static register({ email, pwdHash }) {
        return new Promise<void>((resolve, reject) => {
            db.run('INSERT INTO User (Email, PasswordHash) VALUES ($email, $pwd)', { $email: email, $pwd: pwdHash }, err => {
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