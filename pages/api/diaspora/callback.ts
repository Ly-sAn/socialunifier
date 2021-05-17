import database from "../../../lib/database"
import withSession from "../../../lib/session"

type Params = {
    code: string
}

const clientId = process.env.DIASPORA_ID
const clientSecret = process.env.DIASPORA_SECRET
const callbackUrl = 'http://localhost:3000/api/diaspora/callback'


const tokenUrlTemplate = (code: string) =>
   `https://diasp.org/api/openid_connect/access_tokens?code=${code}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${callbackUrl}`

export default withSession(async (req, res) => {
    const params = req.query as unknown as Params;
    const userId = req.session.get("user");

    if (!userId)
        return res.redirect('/form/login');

    if (!params.code) {
        return res.redirect('/error');
    }

    const responseJson = await (await fetch(tokenUrlTemplate(params.code), {
        method: 'POST'
    })).json()

    if (responseJson.error) {
        console.log(`Message d'erreur reçu depuis mastodon: ${JSON.stringify(responseJson)}`);
        return res.redirect('/error');
    }

    await database.saveToken({ socialNetwork: "Diaspora", token: responseJson.access_token, userId, expire: new Date(Date.now() + +responseJson.expires_in) })

    res.redirect('/temp/account');

})