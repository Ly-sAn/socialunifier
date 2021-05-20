import { DbToken } from "../../types/db";
import { Media, SocialNetwork } from "../../types/global";
import database from "../database";
import { RequestError } from "../errors";

export default abstract class SocialNetworkApi {
    networkName: SocialNetwork;
    protected userId: number;
    protected token: string;
    protected dbToken: DbToken;

    protected constructor(userId: number, networkName: SocialNetwork) {
        this.userId = userId;
        this.networkName = networkName;
    }

    async prepare(): Promise<void> {
        this.dbToken = await database.getToken(this.userId, this.networkName);

        if (!this.dbToken)
            throw new RequestError(`Vous n'êtes pas connecté à ${this.networkName}.`)

        this.token = this.dbToken.Code;

        if (this.dbToken.Expire && this.dbToken.Expire < new Date())
            await this.refresh();
    }

    protected async refresh(): Promise<void> {
        throw new Error("Not implemented");
    }

    abstract post(content: string, medias: Media[], option?: any): Promise<string>;

}