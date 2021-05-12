import Link from 'next/link';
import styles from '../../styles/forms/Register.module.scss';
import Navbar from '../../components/navbar';
import router from 'next/router';
import { fetchApi, RegisterError } from '../../lib/api';

export default function Register() {

    async function register(e) {
        e.preventDefault()

        const result = await fetchApi('/api/register', 'POST', {
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
            <Navbar/>
            <section className={styles.form_container}>
                <div className={styles.container}>
                    <div className={styles.moved_element}>
                        <div className={styles.form_register_left}>
                            <div className={styles.form_register_left_content}>
                                <h1>Social Unifier</h1>
                                <h3>Welcome to register page</h3>
                            </div>
                        </div>
                        <div className={styles.form_register_right}>
                            <div className={styles.form_container_right}>
                                <div className={styles.form_register_title}>
                                    <h2>Register</h2>
                                </div>

                                <form onSubmit={register} id={styles.form_register}>
                                    <div className={styles.form_group}>
                                        <label htmlFor="#">Full name</label>
                                        <input type="text"/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="email">Email</label>
                                        <input name="email" type="email" required/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="password">Password</label>
                                        <input name="password" type="password" required/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label htmlFor="#">Confirm password</label>
                                        <input type="password"/>
                                    </div>
                                </form>

                                <button type="submit" form={styles.form_register}>Create Account</button>
                                <p className={styles.exist_account}>Already have an account ?
                                    <span>
                                    <Link href="/forms/login">
                                        <a>Log in</a>
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