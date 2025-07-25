'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/services/api';
import { userStore } from '@/lib/stores/user-store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function Logout() {
    const router = useRouter();
    const { setCredentials } = userStore();

    const { mutate: logout } = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            setCredentials({
                user: null,
                accessToken: null,
            });

            toast('Log out Successful', {
                description: 'See you again',
            });

            router.push('/');
        },
    });

    return (
        <Button variant="ghost" onClick={() => logout()} className="fixed top-5 right-8">
            Log out
        </Button>
    );
}
