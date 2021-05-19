import { NextApiRequest, NextApiResponse } from "next";
import { PostError } from "../../lib/api";
import withSession from "../../lib/session";
import Mastodon from "../../lib/social-networks/mastodon";
import Reddit from "../../lib/social-networks/reddit";
import Tumblr from "../../lib/social-networks/tumblr";
import SocialNetworkApi from "../../lib/social-networks/SocialNetworkApi";
import { ApiResult, Media, SessionRequest, SocialNetwork } from "../../types/global";
import multer from "multer";
import crypto from "crypto";
import FormData from "form-data";
import DatauriParser from "datauri/parser";
import path from "path";

const cloudinaryId = process.env.CLOUDINARY_ID;
const cloudinarySecret = process.env.CLOUDINARY_SECRET;
const cloudinaryName = process.env.CLOUDINARY_NAME;

const upload = multer({ limits: { fieldSize: 1e7 } });

const mediaUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryName}/auto/upload`;

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
    const { files } = req as unknown as SessionRequest & { files: any[] }

    let media: Media;
    
    if (files.length > 0) {
        const file = files[0];

        const formData = new FormData();
        const timestamp = Math.floor(Date.now() / 1000);
        
        const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${cloudinarySecret}`).digest('hex');

        const dataUri = new DatauriParser().format(path.extname(file.originalname), file.buffer).content;       
        
        formData.append('timestamp', timestamp.toString());
        formData.append('file', dataUri);
        formData.append('signature', signature);
        formData.append('api_key', cloudinaryId);
        
        const response = await (await fetch(mediaUploadUrl, {
            method: 'POST',
            body: formData,
        })).json();

        if (response.error)
        {
            console.log("Erreur depuis Cloudinary: " + JSON.stringify(response));
            
            return res.json({ success: false, reason: PostError.MediaUploadError })
        }
        
        media = {
            url: response.url,
            mimeType: file.mimetype,
            buffer: file.buffer,
            fileName: file.originalname,
        }
    }
    
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
                        api.post(content, media, redditOptions);
                        break;
                    default:
                        api.post(content, media);
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