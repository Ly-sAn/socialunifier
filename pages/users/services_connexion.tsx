import styles from '../../styles/users/ServiceConnexion.module.scss'
import Link from "next/link";
import { ApiRoute } from "../../lib/api";
import useUser from "../../lib/useUser";
import Layout from "../../components/layout";
import { UserLoggedIn } from "../../types/global";


export default function ServicesConnexion() {
    const user = useUser() as UserLoggedIn;
    let userName: string;

    if (!user?.isLoggedIn)
        return <Layout><p>Chargement...</p></Layout>

    userName = user.userName;

    const green = ' bg-gradient-to-br from-green-200 to-green-700';
    const red = ' bg-gradient-to-br from-red-200 to-red-700';

    return (
        <Layout>
            <section className={styles.services_connect_container + ' bg-gradient-to-br from-red-50 via-indigo-300 to-blue-300 md:mx-auto md:my-12 max-w-7xl m-2 shadow-xl md:p-6 p-2 rounded'}>
                <div className={styles.services_connect_title}>
                    Bienvenue {userName}
                </div>
                <Link href="/users/account_update">
                    <a className={styles.services_update_link}>Modifier vos informations &rarr;</a>
                </Link>
                <div className={styles.services_social_media_container}>
                    <div className={styles.services_social_media}>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeReddit}>
                                <a className={styles.services_social_btn + (user.networks.includes('Reddit') ? green : red)}>Reddit</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeMastodon}>
                                <a className={styles.services_social_btn + (user.networks.includes('Mastodon') ? green : red)}>Mastodon</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeTumblr}>
                                <a className={styles.services_social_btn + (user.networks.includes('Tumblr') ? green : red)}>Tumblr</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}