import currentActions from "../../../lib/currentActions";
import database from "../../../lib/database"
import withSession from "../../../lib/session";
import querystring from "querystring";
import { OAuthRequest } from "../../../lib/OAuthRequest";

type Params = {
    oauth_token: string,
    oauth_verifier: string,
    source: string
}

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_SECRET_KEY;

const tokenUrlTemplate = (verifier: string, token: string) =>
    `https://www.tumblr.com/oauth/access_token?oauth_verifier=${verifier}`

export default withSession(async (req, res) => {
    const params = req.query as unknown as Params;
    const userId = req.session.get("user");

    if (!userId)
        return res.redirect('/form/login');

    if (!params.oauth_verifier)
        return res.redirect('/error');
    
    const tempCredentials = await currentActions.retrieve(params.source);

    if (!tempCredentials)
        return res.redirect('/error?e=code');

    const oauthRequest = new OAuthRequest({
        key, secret,
        method: 'POST',
        url: tokenUrlTemplate(params.oauth_verifier, tempCredentials.oauth_token),        
        tokenKey: tempCredentials.oauth_token,
        tokenSecret: tempCredentials.oauth_token_secret,
    })

    const plainResponse = await oauthRequest.fetchText();
    const response = querystring.parse(plainResponse);

    if (!response.oauth_token) {
        console.log(`Message d'erreur reçu depuis tumblr: ${plainResponse}`);
        return res.redirect('/error');
    }

    await database.saveToken({ socialNetwork: 'Tumblr', userId, token: response.oauth_token as string, tokenSecret: response.oauth_token_secret as string})

    res.redirect('/users/services_connexion');
})