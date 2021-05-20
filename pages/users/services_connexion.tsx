import styles from '../../styles/users/ServiceConnexion.module.scss'
import LeftNavBar from "../../components/leftNavbar";
import Link from "next/link";
import { ApiRoute } from "../../lib/api";
import useUser from "../../lib/useUser";
import Layout from "../../components/layout";
import {UserLoggedIn} from "../../types/global";



export default function ServicesConnexion() {
    const user = useUser() as UserLoggedIn;
    let userName : string, bgcolor, reddit;

    if (user?.isLoggedIn) {
        userName = user.userName;
        console.log(user.networks)
    }
    // user.networks.some(r => r == 'Reddit') ? 'Green' : 'Red'


    return (
        <Layout>
            <section className={styles.services_connect_container}>
                <div className={styles.services_connect_title}>
                    Bienvenue {userName}
                </div>
                <div className={styles.services_social_media_container}>
                    <div className={styles.services_social_media}>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeReddit}>
                                <a style={ { background: user?.networks.includes('Reddit') ? 'Green' : 'Red'}} className={styles.services_social_btn}>Reddit</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeMastodon}>
                                <a style={ { background: user?.networks.includes('Mastodon') ? 'Green' : 'Red'}} className={styles.services_social_btn}>Mastodon</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeTumblr}>
                                <a style={{ background: user?.networks.includes('Tumblr') ? 'Green' : 'Red'}} className={styles.services_social_btn}>Tumblr</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}