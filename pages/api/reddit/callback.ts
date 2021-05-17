import currentActions from "../../../lib/currentActions";
import database from "../../../lib/database";
import withSession from "../../../lib/session"

type Params = {
    code: string,
    state: string,
    error: string,
}

const redditId = process.env.REDDIT_ID;
const redditSecret = process.env.REDDIT_SECRET;

export default withSession(async (req, res) => {
    const params = req.query as unknown as Params;
    const userId = req.session.get("user");

    if (!userId)
        return res.redirect('/form/login');

    if (params.error) {
        if (params.error === 'access_denied')
            return res.redirect('/error?e=access_denied');
        else {
            console.log(`Message d'erreur reçu depuis reddit: ${params.error}`);
            return res.redirect('/error');
        }
    }

    if (!currentActions.check(params.state, { userId }))
        return res.redirect('/error?e=code')

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            code: params.code,
            'redirect_uri': 'http://localhost:3000/api/reddit/callback'
        }),
        headers: {
            Authorization: 'Basic ' + Buffer.from(redditId + ':' + redditSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    const json = await response.json();

    if (!response.ok || json.error) {
        console.log(`Message d'erreur reçu depuis reddit: ${JSON.stringify(json)}`);
        return res.redirect('/error');
    }
    
    await database.saveToken({ socialNetwork: "Reddit", userId, token: json.access_token, expire: new Date(Date.now() + +json.expires_in), refreshToken: json.refresh_token })

    res.redirect('/temp/account')
})