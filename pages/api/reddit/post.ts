import { NextApiResponse } from "next";
import { PostError } from "../../../lib/api";
import database from "../../../lib/database";
import withSession from "../../../lib/session";
import { ApiResult } from "../../../types/global";

const urlTemplate = (subreddit: string, content: string, title: string) => 
    `https://oauth.reddit.com/api/submit?kind=self&sr=${subreddit}&text=${content}&title=${title}`

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    const { subreddit, content, title } = await req.body;
    const userId = req.session.get('user');

    if (!userId)
        return res.json({ success: false, reason: PostError.NotLoggedIn })
        
    const token = await database.getToken(userId, 'Reddit');
        
    if (!token)
        return res.json({ success: false, reason: PostError.NoCredentials })
    
    const response = await fetch(urlTemplate(encodeURIComponent(subreddit), encodeURIComponent(content), encodeURIComponent(title)), {
        headers: {
            Authorization: `bearer ${token.Code}`
        },
        method: "POST"
    })

    console.log(await response.text());

    res.json({success: true})
})