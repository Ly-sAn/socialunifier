import Layout from "../../components/layout";
import { ApiRoute } from "../../lib/api";
import useUser from "../../lib/useUser";

export default function Authorize() {
    useUser();

    return (
        <Layout>
            <a href={ApiRoute.AuthorizeReddit}>Reddit &rarr;</a>
            <br />
            <a href={ApiRoute.AuthorizeMastodon}>Mastodon &rarr;</a>
            <br />
            <a href={ApiRoute.AuthorizeDiaspora}>Diaspora &rarr;</a>
        </Layout>
    )
}