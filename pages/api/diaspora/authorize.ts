import withSession from "../../../lib/session"

const callbackUrl = 'http://localhost:3000/api/diaspora/callback';
const scope = 'write';
const clientId = process.env.DIASPORA_ID;

const url = `https://diasp.org/api/openid_connect/authorizations/new?response_type=code&scope=${scope}&redirect_uri=${callbackUrl}&client_id=${clientId}`;

export default withSession((req, res) => {
    const userId = req.session.get('user')
    if (!userId)
        return res.status(401).send('Please login');
    
    res.redirect(url);
})