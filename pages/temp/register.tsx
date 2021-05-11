import * as api from "../../lib/api";
import { useRouter } from 'next/router'
import { useState } from "react";

export default function Login() {
    const [errorMessage, setErrorMessage] = useState(null);

    const router = useRouter();

    async function register(e) {
        e.preventDefault()

        const result = await api.fetch('/api/register', 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        if (result.success)
            router.push('/temp/account');
        else
            setErrorMessage('Impossible');
    }

    return (
        <>
            <h1>Créer un compte</h1>
            <form onSubmit={register}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required />
                <button type="submit">Créer un compte</button>
                {errorMessage ? <div>{errorMessage}</div> : ''}
            </form>
        </>
    )
}