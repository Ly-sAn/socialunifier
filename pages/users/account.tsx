import Navbar from "../../components/navbar";
import useUser from "../../lib/useUser";
import styles from '../../styles/users/Account.module.scss';
import LeftNavBar from "../../components/leftNavbar";


const UserAccount = () => {

    const user = useUser();
    let userName : string;

    if (user && user.isLoggedIn) {
        userName = user.userName;
    }

      return (
        <>
            <LeftNavBar />
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
        </>
      )
}

export default UserAccount