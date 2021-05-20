import loginStyles from "../../styles/forms/Login.module.scss";
import Link from "next/link";
import { ApiRoute, fetchApi, LoginError } from "../../lib/api";
import router from "next/router";
import ErrorBanner, { showError } from "../../components/error-banner";
import Layout from "../../components/layout";
import { useState } from "react";
import LoadingAnim from "../../components/loading-anim";


export default function Login() {
    const [isLoading, setLoading] = useState(false);
    
    async function login(e) {
        e.preventDefault();

        setLoading(true);
        const result = await fetchApi(ApiRoute.Login, 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        setLoading(false);

        // sans le '=== true' typescript n'est pas content
        if (result.success === true)
            router.push('/users/account');
        else {
            let message: string;
            switch (result.reason) {
                case LoginError.InvalidLogins:
                    message = "Email ou mot de passe invalid"; break;            
                default:
                    message = "Une erreur est survenue"; break;
            }
            showError(message);
        }
    }

    return (
        <Layout title="Connexion">            
            <section className={loginStyles.form_container}>
                <div className={loginStyles.container}>
                    <div className={loginStyles.moved_element}>
                        <div className={loginStyles.form_register_left_login}>
                            <div className={loginStyles.form_register_left_content}>
                                <h1>Social Unifier</h1>
                            </div>
                        </div>
                        <div className={loginStyles.form_register_right_login}>
                            <div className={loginStyles.form_container_right}>

                                <form onSubmit={login} className={loginStyles.form_register}>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="email">E-mail</label>
                                        <input name="email" type="email" required/>
                                    </div>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="password">Mot de passe</label>
                                        <input name="password" type="password" required/>
                                    </div>

                                    <button type="submit" disabled={isLoading}>Connexion<LoadingAnim visible={isLoading} /></button>

                                </form>

                                <p className={loginStyles.exist_account}>Vous n'avez pas de compte ?
                                    <span>
                                    <Link href="/forms/register">
                                        <a>Rejoignez-nous</a>
                                    </Link>
                                </span>
                                </p>
                                <ErrorBanner/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}