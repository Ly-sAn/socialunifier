import { OAuthRequest } from "../OAuthRequest";
import SocialNetworkApi from "./SocialNetworkApi";

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
        console.log(userInfo.response.user.blogs[0]);
        this.blogName = userInfo.response.user.blogs[0].name;
    }


    async post(content: string): Promise<void> {
        const oauthRequest = new OAuthRequest({
            key, secret,
            method: 'POST',
            url: urlTemplate(this.blogName),
            tokenKey: this.dbToken.Code,
            tokenSecret: this.dbToken.Secret,

            body: {
                content: [
                    {
                        type: 'text',
                        text: content
                    }
                ],
            },
        });

        const response = await oauthRequest.fetch();

        console.log("Tumblr a répondue:\n" + await response.text());
    }
}