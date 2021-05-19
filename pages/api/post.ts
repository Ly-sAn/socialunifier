import { NextApiRequest, NextApiResponse } from "next";
import { PostError } from "../../lib/api";
import withSession from "../../lib/session";
import Mastodon from "../../lib/social-networks/mastodon";
import Reddit from "../../lib/social-networks/reddit";
import Tumblr from "../../lib/social-networks/tumblr";
import SocialNetworkApi from "../../lib/social-networks/SocialNetworkApi";
import { ApiResult, Media, SessionRequest, SocialNetwork } from "../../types/global";
import multer from "multer";

const upload = multer({ limits: { fieldSize: 1e7 } });
function initMiddleware(middleware: any) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}
const multerAny = initMiddleware(
    upload.any()
);


export const config = {
    api: {
        bodyParser: false
    }
}

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    await multerAny(req, res);
    const { files } = req as unknown as SessionRequest & { files: any[] };

    let medias: Media[] = files.map(f => {
        return {
            mimeType: f.mimetype,
            buffer: f.buffer,
            fileName: f.originalname,
        }
    });

    const { selectedNetworks, content, redditOptions } = JSON.parse(req.body.request);

    const userId = req.session.get('user');

    if (!userId)
        return res.json({ success: false, reason: PostError.NotLoggedIn })

    const apis: SocialNetworkApi[] = selectedNetworks.map((n: SocialNetwork) => {
        switch (n) {
            case 'Reddit':
                return new Reddit(userId);
            case 'Mastodon':
                return new Mastodon(userId);
            case 'Tumblr':
                return new Tumblr(userId);
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
                        api.post(content, medias, redditOptions);
                        break;
                    default:
                        api.post(content, medias);
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