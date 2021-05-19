import withSession from "../../../lib/session"
import currentActions from "../../../lib/currentActions";
import querystring from "querystring";
import { OAuthRequest } from "../../../lib/OAuthRequest";

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_SECRET_KEY;

const url = (token: string, code: string) =>
    `https://www.tumblr.com/oauth/authorize?oauth_token=${token}&source=${code}`

export default withSession(async (req, res) => {
    const userId = req.session.get('user');
    if (!userId)
        return res.status(401).send('Please login');
    
    const oauthRequest = new OAuthRequest({
        key, secret,
        method: 'POST',
        url: 'https://www.tumblr.com/oauth/request_token',
    });

    const plainResponse = await oauthRequest.fetchText();
    const response = querystring.parse(plainResponse);

    const code = await currentActions.save(response);
    
    res.redirect(url(response.oauth_token as string, code));
})