import withSession from "../../../lib/session"
import OAuth from 'oauth-1.0a'
import currentActions from "../../../lib/currentActions";
import { createOAuth } from "../../../lib/OAuthHelper";

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_SECRET_KEY;

const url = (token: string, code: string) =>
    `https://www.tumblr.com/oauth/authorize?oauth_token=${token}&source=${code}`

export default withSession(async (req, res) => {
    const userId = req.session.get('user');
    if (!userId)
        return res.status(401).send('Please login');
    
    const oauth = createOAuth(key, secret);

    const request: OAuth.RequestOptions = {
        method: 'POST',
        url: 'https://www.tumblr.com/oauth/request_token',
    };

    const plainResponse = await (await fetch(request.url, {
        method: request.method,
        headers: oauth.toHeader(oauth.authorize(request)) as unknown as HeadersInit        
    })).text();
    const response = Object.fromEntries(new URLSearchParams(plainResponse));

    const code = await currentActions.save(response);
    
    res.redirect(url(response.oauth_token, code));
})