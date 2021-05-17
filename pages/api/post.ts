import { NextApiResponse } from "next";
import { PostError } from "../../lib/api";
import withSession from "../../lib/session";
import Mastodon from "../../lib/social-networks/mastodon";
import Reddit from "../../lib/social-networks/reddit";
import SocialNetworkApi from "../../lib/social-networks/SocialNetworkApi";
import { ApiResult, SocialNetwork } from "../../types/global";

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    const { selectedNetworks, content, redditOptions } = req.body;

    const userId = req.session.get('user');

    if (!userId)
        return res.json({ success: false, reason: PostError.NotLoggedIn })

    const apis: SocialNetworkApi[] = selectedNetworks.map((n: SocialNetwork) => {
        switch (n) {
            case 'Reddit':
                return new Reddit(userId);
            case 'Mastodon':
                return new Mastodon(userId);
            default:
                throw new Error("Réseau non supporté");
        }
    });

    const results = await Promise.allSettled(
        apis.map(async api => {
            try {
                await api.prepare();

                switch (api.networkName) {
                    case 'Reddit':
                        api.post(content, redditOptions);
                        break;
                    default:
                        api.post(content);
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        })
    );

    if (results.every(r => r.status === 'fulfilled'))
        return res.json({ success: true });
    else
        return res.json({ success: false, reason: PostError.UnknownError });

})