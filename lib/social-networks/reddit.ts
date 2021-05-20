import { Media } from "../../types/global";
import database from "../database";
import SocialNetworkApi from "./SocialNetworkApi";
import crypto from "crypto";
import FormData from "form-data";
import DatauriParser from "datauri/parser";
import path from "path";
import { RequestError } from "../errors";

const cloudinaryId = process.env.CLOUDINARY_ID;
const cloudinarySecret = process.env.CLOUDINARY_SECRET;
const cloudinaryName = process.env.CLOUDINARY_NAME;

const imageUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`;

type OptionType = {
    subreddit: string,
    title: string,
    imagePost: boolean,
}

const redditId = process.env.REDDIT_ID;
const redditSecret = process.env.REDDIT_SECRET;

const textUrlTemplate = (subreddit: string, content: string, title: string) =>
    `https://oauth.reddit.com/api/submit?kind=self&sr=${subreddit}&text=${content}&title=${title}`

const imageUrlTemplate = (subreddit: string, link: string, title: string) =>
    `https://oauth.reddit.com/api/submit?kind=image&sr=${subreddit}&url=${link}&title=${title}`

export default class Reddit extends SocialNetworkApi {
    constructor(userId: number) {
        super(userId, 'Reddit');
    }

    async refresh() {
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'refresh_token',
                'refresh_token': this.dbToken.RefreshToken,
            }),
            headers: {
                Authorization: 'Basic ' + Buffer.from(redditId + ':' + redditSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const json = await response.json();

        if (!response.ok || json.error) {
            throw new Error("Impossible de rafraîchir le token pour Reddit: " + JSON.stringify(json));
        }

        const expire = new Date(Date.now() + +json.expires_in);

        await database.saveToken({ socialNetwork: "Reddit", userId: this.userId, token: json.access_token, expire, refreshToken: json.refresh_token });
        this.token = json.access_token;
    }

    async post(content: string, medias: Media[], option?: OptionType): Promise<string> {
        let imageUrl: string;
        if (medias.length > 0 && medias[0].mimeType.startsWith('image')) {
            imageUrl = await this.uploadImage(medias[0]);
        }

        const url = option.imagePost
            ? imageUrlTemplate(encodeURIComponent(option.subreddit), encodeURIComponent(imageUrl), encodeURIComponent(option.title))
            : textUrlTemplate(encodeURIComponent(option.subreddit), encodeURIComponent(content), encodeURIComponent(option.title));

        const response = await (await fetch(url, {
            headers: {
                Authorization: `bearer ${this.token}`,
            },
            method: "POST",
        })).json();

        console.log("Reddit a répondue:\n" + JSON.stringify(response));
        
        // reddit élue pire réponse d'api du monde
        if (!response.success) 
            throw new RequestError(response.jquery[14][3][0]);
        
        return response.jquery[10][3][0];
    }

    async uploadImage(media:Media): Promise<string> {
        const formData = new FormData();
        const timestamp = Math.floor(Date.now() / 1000);
        
        const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${cloudinarySecret}`).digest('hex');

        const dataUri = new DatauriParser().format(path.extname(media.fileName), media.buffer).content;       
        
        formData.append('timestamp', timestamp.toString());
        formData.append('file', dataUri);
        formData.append('signature', signature);
        formData.append('api_key', cloudinaryId);
        
        const response = await (await fetch(imageUploadUrl, {
            method: 'POST',
            body: formData as unknown as BodyInit,
        })).json();

        if (response.error)
            throw new Error("Erreur en envoyant une image a Cloudinary: " + JSON.stringify(response.error));

        return response.url;
    }
}