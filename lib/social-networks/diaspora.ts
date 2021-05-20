import SocialNetworkApi from "./SocialNetworkApi";

const urlTemplate = (content: string) => 
    `https://diasp.org/api/v1/posts=${content}`;



export default class Diaspora extends SocialNetworkApi {
    constructor(userId: number) {
        super(userId, 'Diaspora');
    }

    async post(content: string): Promise<void> {
        const response = await fetch(urlTemplate(content), {
            headers: {
                Authorization: `bearer ${this.token}`,
            },
            method: "POST",
        });

        console.log("Diaspora a répondue:\n" + await response.text());
    }
}
