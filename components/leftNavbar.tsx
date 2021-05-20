import styles from '../styles/navigation/LeftNav.module.scss'
import Link from 'next/link'


const LeftNavBar = () => {

    return (

        <>
            <div className={styles.left_nav_container}>
                <Link href="/users/account">
                    <a>Mon compte</a>
                </Link>
                <Link href="/users/services_connexion">
                    <a>Me connecter aux services</a>
                </Link>
                <Link href="/users/account_update">
                    <a>Modifier mon profil</a>
                </Link>
                <Link href="/temp/post">
                    <a>Publier un post</a>
                </Link>
                <Link href="/api/auth/logout">
                    <a className={styles.left_nav_logout}>Déconnexion</a>
                </Link>
            </div>
        </>
    )
}

export default LeftNavBar;