import styles from '../../styles/users/Update.module.scss'
import useUser from "../../lib/useUser";
import { UserLoggedIn } from "../../types/global";
import ErrorBanner, { showError } from "../../components/error-banner";
import { ApiRoute, fetchApi, UpdateError } from "../../lib/api";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { useState } from 'react';
import LoadingAnim from '../../components/loading-anim';


export default function AccountUpdate() {
    useUser();

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function update(e) {
        e.preventDefault();

        if (e.target.password.value !== e.target.passwordConfirm.value) {
            return showError('Mot de passe différents');
        }

        setLoading(true);
        const result = await fetchApi(ApiRoute.UpdateUser, 'POST', {
            email: e.target.email.value,
            userName: e.target.userName.value,
            password: e.target.password.value,
        });
        setLoading(false);
        
        if (result.success) {
            router.push('/users/services_connexion');
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


    return (
        <Layout>
            <section className={styles.container}>
                <div className={styles.container_elements + ' md:mx-auto md:my-12 max-w-4xl m-2 shadow-xl md:p-6 p-2 rounded bg-gradient-to-tl from-indigo-400 to-green-200 '}>
                    <div className={styles.user_update_title}>
                        <h1>
                            Modifier mes informations
                        </h1>
                    </div>
                    <p className="text-center">Entrez seulement les champs que vous souhaitez modifier</p>

                    <div className={styles.user_update_form_container}>
                        <form onSubmit={update} className={styles.user_update_form}>
                            <div className={styles.user_update_form_group}>
                                <label htmlFor="user_update_name">Nom d'utilisateur</label>
                                <input
                                    type="text" id="user_update_name"
                                    name="userName" />
                            </div>
                            <div className={styles.user_update_form_group}>
                                <label htmlFor="user_update_email">E-mail</label>
                                <input type="email" id="user_update_email"
                                    name="email" />
                            </div>
                            <div className={styles.user_update_form_group}>
                                <label htmlFor="user_update_password">Mot de passe</label>
                                <input type="password" name="password" id="user_update_password" />
                            </div>
                            <div className={styles.user_update_form_group}>
                                <label htmlFor="user_update_passwordConfirm">Confirmer le mot de passe</label>
                                <input type="password" name="passwordConfirm" id="user_update_passwordConfirm" />
                            </div>
                            <button type="submit" className={styles.user_update_btn}><span>Valider</span><LoadingAnim visible={isLoading}/></button>

                            <ErrorBanner />
                        </form>
                    </div>
                </div>
            </section>
        </Layout>
    )
}