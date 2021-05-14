import Link from "next/link";
import Layout from "../../components/layout";
import useUser from "../../lib/useUser";
import type { UserLoggedIn } from "../../types/global";

export default function Account() {
    const user = useUser() as UserLoggedIn

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>
      

    const networks = user.networks.map(n => <li>{n}</li>);

    return (
        <Layout title="Comte">
            <p>Bienvenue {user.userName}</p>
            <Link href="/temp/authorize"><a>Se connecter a un réseau</a></Link>
            <br />
            <Link href="/temp/post"><a>Créer un post</a></Link>
            
            <p><br />Vous êtes connectez au réseaux suivants:</p>
            {networks.length > 0 ?
                <ul>{networks}</ul> :
                <p>Aucun</p>}
        </Layout>
    )
}