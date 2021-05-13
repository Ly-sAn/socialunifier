import Layout from "../../components/layout";
import userUser from "../../lib/useUser";
import type { UserLoggedIn } from "../../types/global";

export default function Account() {
    const user = userUser() as UserLoggedIn

    if (!user)
        return <Layout><p>Chargement...</p></Layout>
        

    return (
        <Layout>
            <p>Bienvenue {user.userName}</p>
        </Layout>
    )
}