import { Json, Media } from "../../types/global";
import { OAuthRequest } from "../OAuthRequest";
import SocialNetworkApi from "./SocialNetworkApi";
import FormData from "form-data";
import tumblr from "tumblr.js";

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_SECRET_KEY;


const urlTemplate = (blog: string) =>
    `https://api.tumblr.com/v2/blog/${blog}/posts`

export default class Tumblr extends SocialNetworkApi {
    private blogName: string;

    constructor(userId: number) {
        super(userId, 'Tumblr');
    }

    async prepare() {
        await super.prepare();

        const oauthRequest = new OAuthRequest({
            key, secret,
            method: 'GET',
            url: 'https://api.tumblr.com/v2/user/info',
            tokenKey: this.dbToken.Code,
            tokenSecret: this.dbToken.Secret,
        });

        const userInfo = await oauthRequest.fetchJson();
        if (!(userInfo.response.user.blogs?.length > 0 && userInfo.response.user.blogs[0].name)) {
            throw new Error("No blog found");
        }
        this.blogName = userInfo.response.user.blogs[0].name;
    }


    async post(content: string, medias: Media[]): Promise<void> {
        const formData = new FormData();

        const data: Json = {
            content: [
                {
                    type: 'text',
                    text: content,
                }
            ],
        };

        medias.forEach((media, i) => {
            data.content.push({
                type: media.mimeType.split('/')[0],
                media: [
                    {
                        type: media.mimeType,
                        identifier: 'media' + i,
                    },
                ]
            })
            formData.append('media' + i, media.buffer, media.fileName);
        });

        const json = JSON.stringify(data)
        formData.append('json', json, { contentType: 'application/json', knownLength: json.length });

        const oauthRequest = new OAuthRequest({
            key, secret,
            method: 'POST',
            url: urlTemplate(this.blogName),
            tokenKey: this.dbToken.Code,
            tokenSecret: this.dbToken.Secret,

            rawBody: formData,
        });

        const response = await oauthRequest.fetch();

        console.log("Tumblr a répondue:\n" + await response.text());
    }
}