import styles from "../../styles/forms/Register.module.scss";
import loginStyles from "../../styles/forms/Login.module.scss";
import Link from "next/link";
import Navbar from '../../components/navbar';


export default function Login() {

    return (
        <>
            <Navbar />
            <section className={loginStyles.form_container}>
                <section className={loginStyles.container}>
                    <section className={loginStyles.moved_element}>
                        <section className={loginStyles.form_register_left_login}>
                            <div className={loginStyles.form_register_left_content}>
                                <h1>Social Unifier</h1>
                                <h3>Welcome to login page</h3>
                            </div>
                        </section>
                        <section className={loginStyles.form_register_right_login}>
                            <div className={loginStyles.form_container_right}>
                                <div className={loginStyles.form_register_title}>
                                    <h2>Login</h2>
                                </div>

                                <div className={loginStyles.form_register_text}>
                                    <h4>Login to your account</h4>
                                </div>

                                <form action="" className={loginStyles.form_register}>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="#">Username / E-mail</label>
                                        <input type="text"/>
                                    </div>
                                    <div className={loginStyles.form_group}>
                                        <label htmlFor="#">Password</label>
                                        <input type="password"/>
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
                        </section>
                    </section>
                </section>
            </section>
        </>
    )
}