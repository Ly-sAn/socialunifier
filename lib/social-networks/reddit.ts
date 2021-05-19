import { Media } from "../../types/global";
import database from "../database";
import SocialNetworkApi from "./SocialNetworkApi";

type OptionType = {
    subreddit: string,
    title: string,
    postType: 'image' | 'text',
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

    async post(content: string, media: Media, option?: OptionType): Promise<void> {
        const url = option.postType === 'image'
            ? imageUrlTemplate(encodeURIComponent(option.subreddit), encodeURIComponent(media.url), encodeURIComponent(option.title))
            : textUrlTemplate(encodeURIComponent(option.subreddit), encodeURIComponent(content), encodeURIComponent(option.title));

        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${this.token}`,
            },
            method: "POST",
        });

        console.log("Reddit a répondue:\n" + await response.text());
    }
}