import Link from 'next/link';
import styles from '../../styles/forms/Register.module.scss';
import router from 'next/router';
import { ApiRoute, fetchApi, RegisterError } from '../../lib/api';
import React from 'react';
import ErrorBanner, { showError } from '../../components/error-banner';
import Layout from '../../components/layout';

export default function Register() {
    async function register(e) {
        e.preventDefault();

        if (e.target.password.value !== e.target.passwordConfirm.value) {
            return showError("Mots de passe différents")
        }

        const result = await fetchApi(ApiRoute.Register, 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
            userName: e.target.userName.value,
        });

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
                                        <label htmlFor="userName">Nom complet</label>
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

                                <button type="submit" form={styles.form_register}>Create Account</button>
                                <p className={styles.exist_account}>Vous avez déjà un compte ?
                                    <span>
                                        <Link href="/forms/login">
                                            <a>Connecter-vous</a>
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