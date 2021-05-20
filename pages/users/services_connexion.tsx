import styles from '../../styles/users/ServiceConnexion.module.scss'
import LeftNavBar from "../../components/leftNavbar";
import Link from "next/link";
import { ApiRoute } from "../../lib/api";
import useUser from "../../lib/useUser";



export default function ServicesConnexion() {
    useUser();

    return (
        <>
            <LeftNavBar/>
            <section className={styles.services_connect_container}>
                <div className={styles.services_connect_title}>
                    Connexions aux services
                </div>
                <div className={styles.services_social_media_container}>
                    <div className={styles.services_social_media}>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeReddit}>
                                <a className={styles.services_social_btn}>Reddit</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeMastodon}>
                                <a className={styles.services_social_btn}>Mastodon</a>
                            </Link>
                        </div>
                        <div className={styles.services_connect_social_btn}>
                            <Link href={ApiRoute.AuthorizeTumblr}>
                                <a className={styles.services_social_btn}>Tumblr</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}