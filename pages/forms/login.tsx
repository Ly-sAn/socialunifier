import styles from "../../styles/forms/Register.module.scss";
import loginStyles from "../../styles/forms/Login.module.scss";
import Link from "next/link";
import Navbar from '../../components/navbar';
import { fetchApi } from "../../lib/api";
import router from "next/router";


export default function Login() {

    async function login(e) {
        e.preventDefault()

        const result = await fetchApi('/api/login', 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        if (result.success)
            router.push('/temp/account');
        else {
            // gestion des erreurs
        }
    }

    return (
        <>
            <Navbar />
            <section className={loginStyles.form_container}>
                <div className={loginStyles.container}>
                    <div className={loginStyles.moved_element}>
                        <div className={loginStyles.form_register_left_login}>
                            <div className={loginStyles.form_register_left_content}>
                                <h1>Social Unifier</h1>
                                <h3>Welcome to login page</h3>
                            </div>
                        </div>
                        <div className={loginStyles.form_register_right_login}>
                            <div className={loginStyles.form_container_right}>
                                <div className={loginStyles.form_register_title}>
                                    <h2>Login</h2>
                                </div>

                                <div className={loginStyles.form_register_text}>
                                    <h4>Login to your account</h4>
                                </div>

                                <form onSubmit={login} className={loginStyles.form_register}>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="email">E-mail</label>
                                        <input name="email" type="email" required/>
                                    </div>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="password">Password</label>
                                        <input name="password" type="password" required/>
                                    </div>

                                    <button type="submit" form={loginStyles.form_register}>Sign in</button>
                                </form>

                                <p className={loginStyles.exist_account}>Don't have an account ?
                                    <span>
                                    <Link href="/forms/register">
                                        <a>Join us now</a>
                                    </Link>
                                </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}