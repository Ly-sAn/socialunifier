import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSwr from 'swr'
import { ApiRoute } from './api'
import type { User } from '../types/global';

export default function useUser(redirect = true): User {
    const { data: user, error } = useSwr(ApiRoute.User);
    const router = useRouter()

    if (redirect) {
        useEffect(() => {           
            if (error)
                console.error(error)
            if (error || user?.isLoggedIn === false) {
                router.push('/forms/login')
            }
        }, [user, error])
    }

    return user;
}