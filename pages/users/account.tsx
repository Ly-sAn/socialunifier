import Navbar from "../../components/navbar";
import useUser from "../../lib/useUser";
import styles from '../../styles/users/Account.module.scss';
import LeftNavBar from "../../components/leftNavbar";
import Layout from "../../components/layout";


const UserAccount = () => {

    const user = useUser();
    let userName : string;

    if (user && user.isLoggedIn) {
        userName = user.userName;
    }

      return (
        <Layout>
            <section className={styles.account_users}>
                <div className={styles.account_users_welcome}>
                    <div className={styles.account_status}>
                        <span>
                        </span>
                    </div>
                    <div className={styles.account_user_name}>
                        Bienvenue {userName}
                    </div>
                </div>
            </section>
        </Layout>
      )
}

export default UserAccount