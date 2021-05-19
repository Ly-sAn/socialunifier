import database from "../../../lib/database"
import withSession from "../../../lib/session"

type Params = {
    code: string,
    error: string,
}

const clientId = process.env.MASTODON_ID;
const clientSecret = process.env.MASTODON_SECRET;
const callbackUrl = 'http://localhost:3000/api/mastodon/callback';
const scope = 'write';

const tokenUrlTemplate = (code: string) =>
    `https://mastodon.social/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${callbackUrl}&scope=${scope}&code=${code}&grant_type=authorization_code`;

export default withSession(async (req, res) => {
    const params = req.query as unknown as Params;
    const userId = req.session.get("user");

    if (!userId)
        return res.redirect('/form/login');

    if (params.error) {
        if (params.error === 'access_denied')
            return res.redirect('/error?e=access_denied');
        else {
            console.log(`Message d'erreur reçu depuis mastodon: ${params.error}`);
            return res.redirect('/error');
        }
    }

    const responseJson = await (await fetch(tokenUrlTemplate(params.code), {
        method: 'POST',
    })).json();

    if (responseJson.error) {
        console.log(`Message d'erreur reçu depuis mastodon: ${JSON.stringify(responseJson)}`);
        return res.redirect('/error');
    }


    await database.saveToken({ socialNetwork: "Mastodon", token: responseJson.access_token, userId })

    res.redirect('/temp/account');
})