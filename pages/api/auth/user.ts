import { NextApiResponse } from "next";
import database from "../../../lib/database";
import withSession from "../../../lib/session";
import type { User } from "../../../types/global";

export default withSession(async (req, res: NextApiResponse<User>) => {
    const userSession = req.session.get('user')

    if (!userSession) {
        return res.json({ isLoggedIn: false })
    }

    const user = await database.getAccount(userSession);

    res.json({
        isLoggedIn: true,
        email: user.Email,
        userName: user.UserName
    })
})