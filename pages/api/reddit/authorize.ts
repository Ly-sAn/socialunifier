import currentActions from "../../../lib/currentActions";
import withSession from "../../../lib/session";

const callbackUrl = 'http://localhost:3000/api/reddit/callback';
const scope = 'submit';
const clientId = process.env.REDDIT_ID;

const urlTemplate = (state: string) =>
    `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${callbackUrl}&duration=permanent&scope=${scope}`

export default withSession((req, res) => {
    const userId = req.session.get('user')
    if (!userId)
        return res.status(401).send('Please login');

    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    currentActions.save(randomString, userId, 'Reddit');

    const url = urlTemplate(randomString);
    res.redirect(url);
})