import * as api from "../../lib/api";
import { useRouter } from 'next/router'
import { useState } from "react";

export default function Logout() {
    const router = useRouter();

    async function logout() {
        await api.fetch('/api/logout', 'POST', {});
        router.push('/')
    }

    return (
        <>
            <button onClick={logout}>Déconnexion</button>
        </>
    )
}