import Layout from "../../components/layout";
import { ApiRoute } from "../../lib/api";

export default function Authorize() {
    return (
        <Layout>
            <a href={ApiRoute.AuthorizeReddit}>Reddit &rarr;</a>
        </Layout>
    )
}