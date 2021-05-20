import Link from 'next/link';
import styles from '../../styles/forms/Register.module.scss';
import router from 'next/router';
import { ApiRoute, fetchApi, RegisterError } from '../../lib/api';
import React, { useState } from 'react';
import ErrorBanner, { showError } from '../../components/error-banner';
import Layout from '../../components/layout';
import LoadingAnim from '../../components/loading-anim';

export default function Register() {
    const [isLoading, setLoading] = useState(false);

    async function register(e) {
        e.preventDefault();

        if (e.target.password.value !== e.target.passwordConfirm.value) {
            return showError("Mots de passe différents")
        }

        setLoading(true);
        const result = await fetchApi(ApiRoute.Register, 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
            userName: e.target.userName.value,
        });
        setLoading(false);

        // sans le '=== true' typescript n'est pas content
        if (result.success === true)
            router.push('/temp/account');
        else {
            var message: string;
            switch (result.reason) {
                case RegisterError.ExistingEmail:
                    message = "Cette email est déja utilisé"; break;
                case RegisterError.InvalidEmail:
                    message = "Email invalid"; break;
                default:
                    message = "Une erreur est survenue"; break;
            }
            showError(message);
        }
    }

    return (
        <Layout title="Inscription">
            <section className={styles.form_container}>
                <div className={styles.container}>
                    <div className={styles.moved_element}>
                        <div className={styles.form_register_left}>
                            <div className={styles.form_register_left_content}>
                                <h1>Social Unifier</h1>
                            </div>
                        </div>
                        <div className={styles.form_register_right}>
                            <div className={styles.form_container_right}>

                                <form onSubmit={register} id={styles.form_register}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="userName">Nom d'utilisateur </label>
                                        <input name="userName" type="text" required />
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="email">Email</label>
                                        <input name="email" type="email" required />
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="password">Mot de passe</label>
                                        <input name="password" type="password" required />
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
                                        <input name="passwordConfirm" type="password" required />
                                    </div>

                                </form>

                                <button type="submit" form={styles.form_register} disabled={isLoading}>Créer un compte<LoadingAnim visible={isLoading}/></button>
                                <p className={styles.exist_account}>Vous avez déjà un compte ?
                                    <span>
                                        <Link href="/forms/login">
                                            <a>Connectez-vous</a>
                                        </Link>
                                    </span>
                                </p>
                                <ErrorBanner />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}