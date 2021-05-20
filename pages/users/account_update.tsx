import LeftNavBar from "../../components/leftNavbar";
import styles from '../../styles/users/Update.module.scss'
import useUser from "../../lib/useUser";
import {UserLoggedIn} from "../../types/global";
import ErrorBanner, {showError} from "../../components/error-banner";
import {ApiRoute, fetchApi, RegisterError, UpdateError} from "../../lib/api";
import {useRouter} from "next/router";
import {useState} from "react";
import {use} from "ast-types";


export default function AccountUpdate() {

    const user = useUser() as UserLoggedIn;
    const router = useRouter();
   /* const [value, setValue] = useState({
        userName: user?.isLoggedIn ? user.userName : '',
    });

    const handleChange = e => {
        const {val} = e.target
        setValue(val);
    } */

    async function update (e) {
        e.preventDefault();


        if (user?.isLoggedIn) {

            let result, password, email, userName;

            if (e.target.password.value !== e.target.passwordConfirm.value) {
                return showError('Mot de passe différents');
            }

            if (e.target.email.value !== user.email || e.target.userName.value !== user.userName || e.target.password.length >= 3) {
                email = e.target.email.value;
                password = e.target.password.value;
                userName = e.target.userName.value;

                result = await fetchApi(ApiRoute.Update, 'POST', {
                    email: email,
                    password: password,
                    userName: userName,
                    id: user.Id
                })

            } else {
                if (e.target.email.value === user.email) {
                    email = user.email
                }

                if (e.target.userName.value === user.userName) {
                    userName = user.userName;
                }

                result = await fetchApi(ApiRoute.Update, 'POST', {
                    email: email,
                    userName: userName,
                    id: user.Id
                })
            }

            console.log(result)


            if (result.success) {
                router.push('/users/account');
            } else {

                let message: string;
                switch (result.reason) {
                    case UpdateError.ExistingEmail:
                        message = "Cette email est déja utilisé"; break;
                    case UpdateError.InvalidEmail:
                        message = "Email invalid"; break;
                    default:
                        message = "Une erreur est survenue"; break;
                }
                showError(message);
            }
        }

    }



    return (

        <>
            <LeftNavBar />
            <section className={styles.container}>
                <div className={styles.user_update_title}>
                    <h1>
                        Modifier mes informations
                    </h1>
                </div>

                <div className={styles.user_update_form_container}>
                    <form onSubmit={update} className={styles.user_update_form}>
                        <div className={styles.user_update_form_group}>
                            <label htmlFor="user_update_name">Nom d'utilisateur</label>
                            <input
                                type="text" id="user_update_name"
                                name="userName"/>
                        </div>
                        <div className={styles.user_update_form_group}>
                            <label htmlFor="user_update_email">E-mail</label>
                            <input type="email" id="user_update_email"
                                   name="email" />
                        </div>
                        <div className={styles.user_update_form_group}>
                            <label htmlFor="user_update_password">Mot de passe</label>
                            <input type="password" name="password" id="user_update_password"/>
                        </div>
                        <div className={styles.user_update_form_group}>
                            <label htmlFor="user_update_passwordConfirm">Confirmer le mot de passe</label>
                            <input type="password" name="passwordConfirm" id="user_update_passwordConfirm"/>
                        </div>
                        <button type="submit" className={styles.user_update_btn}>Valider</button>
                    </form>
                </div>
            </section>
        </>
    )
}