import { NextApiResponse } from "next";
import withSession from "../../lib/session";
import { ApiResult } from "../../types/global";
import bcrypt from 'bcrypt'
import database from "../../lib/database";

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    try {
        const { email, password } = await req.body;
       
        const user = await database.getAccount({ email })
        
        const isCorrect = await bcrypt.compare(password, user?.PasswordHash)

        if (isCorrect) {
            req.session.set("user", { email })
            await req.session.save()
            res.json({success: true})
        }
        else {
            await req.session.destroy()
            res.json({success: false})
        }

    } catch (err){
        console.error(err);
        res.json({ success: false })
    }
})