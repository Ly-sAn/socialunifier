import { Media } from "../../types/global";
import SocialNetworkApi from "./SocialNetworkApi";
import FormData from "form-data";

const url = 'https://mastodon.social/api/v1/statuses';

export default class Mastodon extends SocialNetworkApi {
    constructor(userId: number) {
        super(userId, 'Mastodon');
    }

    async post(content: string, media: Media): Promise<void> {
        const headers = {
            Authorization: `bearer ${this.token}`,
        };

        const mediaIds = []
        console.log(media);

        if (media) {
            const formData = new FormData();
            formData.append('file', media.buffer, "test.png");

            const response = await (await fetch('https://mastodon.social/api/v1/media', {
                headers,
                method: "POST",
                body: formData,
            })).json();

            if (response.error)
                throw new Error("Erreur en envoyant une image a Mastodon: " + response.error);
            
            mediaIds.push(response.id);
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                status: content,
                media_ids: mediaIds,
            })
        });

        console.log("Mastodon a répondue:\n" + await response.text());
    }
}