import Layout from "../../components/layout";
import { ApiRoute } from "../../lib/api";
import userUser from "../../lib/useUser";

export default function Authorize() {
    userUser();

    return (
        <Layout>
            <a href={ApiRoute.AuthorizeReddit}>Reddit &rarr;</a>
        </Layout>
    )
}