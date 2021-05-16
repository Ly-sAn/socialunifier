import SocialNetworkApi from "./SocialNetworkApi";

const urlTemplate = (content: string) => 
    `https://mastodon.social/api/v1/statuses?status=${content}`

export default class Mastodon extends SocialNetworkApi {
    constructor(userId: number) {
        super(userId, 'Mastodon');
    }


    async post(content: string): Promise<void> {
        const response = await fetch(urlTemplate(content), {
            headers: {
                Authorization: `bearer ${this.token}`
            },
            method: "POST"
        });

        console.log("Mastodon a répondue:\n" + await response.text());
    }
}