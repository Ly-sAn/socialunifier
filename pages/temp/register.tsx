import { useRouter } from 'next/router'
import { useState } from "react";
import { fetchApi, RegisterError } from "../../lib/api";

export default function Login() {
    const [errorMessage, setErrorMessage] = useState(null);

    const router = useRouter();

    async function register(e) {
        e.preventDefault()

        const result = await fetchApi('/api/register', 'POST', {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        if (result.success)
            router.push('/temp/account');
        else {
            let message: string
            switch (result.reason) {
                case RegisterError.ExistingEmail:
                    message = "Cette email est déja utilisé"; break;
                case RegisterError.InvalidEmail:
                    message = "Email invalid"; break;
                default:
                    message = "Une erreur est survenue"; break;
            }
            setErrorMessage(message)
        }
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