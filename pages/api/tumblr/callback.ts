import OAuth from "oauth-1.0a";
import currentActions from "../../../lib/currentActions";
import database from "../../../lib/database"
import { createOAuth } from "../../../lib/OAuthHelper";
import withSession from "../../../lib/session"

type Params = {
    oauth_token: string,
    oauth_verifier: string,
    source: string
}

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_SECRET_KEY;

const tokenUrlTemplate = (token: string) =>
    `https://www.tumblr.com/oauth/access_token?oauth_verifier=${token}`

export default withSession(async (req, res) => {
    const params = req.query as unknown as Params;
    const userId = req.session.get("user");

    if (!userId)
        return res.redirect('/form/login');

    if (!params.oauth_verifier)
        return res.redirect('/error');
    
    //const tempCredentials = await currentActions.retrieve(params.source)

    // if (!tempCredentials)
    //     return res.redirect('/error?e=code');

    const oauth = createOAuth(key, secret);

    const request: OAuth.RequestOptions = {
        method: 'GET',
        url: tokenUrlTemplate(params.oauth_verifier),
    };

    console.log(request);
    //console.log(tempCredentials);
    

    const plainResponse = await (await fetch(request.url, {
        method: request.method,
        headers: oauth.toHeader(oauth.authorize(request)) as unknown as HeadersInit,
    })).text()


    // if (plainResponse.error) {
    //     console.log(`Message d'erreur reçu depuis mastodon: ${JSON.stringify(plainResponse)}`);
    //     return res.redirect('/error');
    // }

    // await database.saveToken({ socialNetwork: "Mastodon", token: plainResponse.access_token, userId })

    res.send(plainResponse);

})