import withSession from "../../../lib/session";
import type {NextApiResponse} from "next";
import {ApiResult} from "../../../types/global";
import {RegisterError, UpdateError} from "../../../lib/api";
import bcrypt from 'bcrypt'
import database from "../../../lib/database";


const emailRegex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {

    try {

        const userSession: number = req.session.get('user')

        const {email, password, userName} = req.body;

        console.log(req.body)

        if (!emailRegex.test(email)) {
            return res.json({ success: false, reason: UpdateError.InvalidEmail});
        }

        const pwHash = await bcrypt.hash(password, 3);
        await database.updateUser({email, pwHash, userName, id: userSession});

        await req.session.save();
        res.json({ success: true });

    } catch (error) {
        if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: User.Email')
            res.json({ success: false, reason: UpdateError.ExistingEmail });

        else {
            res.json({ success: false, reason: UpdateError.UnknownError });
            console.error(error);
        }
    }
})