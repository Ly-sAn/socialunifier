import withSession from "../../../lib/session"

const callbackUrl = 'http://localhost:3000/api/mastodon/callback';
const scope = 'write';
const clientId = process.env.MASTODON_ID;

const url = `https://mastodon.social/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}`

export default withSession((req, res) => {
    const userId = req.session.get('user')
    if (!userId)
        return res.status(401).send('Please login');
    
    res.redirect(url);
})