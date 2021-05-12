import { useRouter } from 'next/router'
import { useState } from "react";
import { fetchApi, LoginError } from "../../lib/api";


export default function Login() {
    const [errorMessage, setErrorMessage] = useState(null);

    const router = useRouter();

    async function login(e) {
        e.preventDefault()

        const result = await fetchApi('/api/login', 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        if (result.success)
            router.push('/temp/account');
        else {
            let message: string;
            switch (result.reason) {
                case LoginError.InvalidLogins:
                    message = "Email ou mot de passe invalid"; break;
                default:
                    message = "Une erreur est survenue"; break;
            }
            setErrorMessage(message);
        }
    }

    return (
        <>
            <h1>Se connecter</h1>
            <form onSubmit={login}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required />
                <button type="submit">Se connecter</button>
                {errorMessage ? <div>{errorMessage}</div> : ''}
            </form>
        </>
    )
}