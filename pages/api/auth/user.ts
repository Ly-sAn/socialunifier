import { NextApiResponse } from "next";
import database from "../../../lib/database";
import withSession from "../../../lib/session";
import type { User } from "../../../types/global";

export default withSession(async (req, res: NextApiResponse<User>) => {
    const userSession: number = req.session.get('user')

    if (!userSession) {
        return res.json({ isLoggedIn: false })
    }

    const user = await database.getAccount(userSession);    
    
    const tokens = await database.getAllTokensForUser(userSession);
    const networks = tokens.map(t => t.Network);
    
    res.json({
        isLoggedIn: true,
        email: user.Email,
        userName: user.UserName,
        networks,
    });
})