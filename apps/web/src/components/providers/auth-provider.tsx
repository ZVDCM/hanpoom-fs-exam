'use client';

import { api } from '@/lib/services/api';
import { userStore } from '@/lib/stores/user-store';
import { ErrorMessage, LoginResponse } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import React from 'react';

interface AuthProviderProps {
    auth: React.ReactNode;
    home: React.ReactNode;
}

export default function AuthProvider({
    children,
    auth,
    home,
}: Readonly<React.PropsWithChildren<AuthProviderProps>>) {
    const { accessToken, setCredentials } = userStore();

    const { data, isFetching, error } = useQuery<
        void,
        AxiosError<ErrorMessage>,
        AxiosResponse<LoginResponse>
    >({
        queryKey: ['auth'],
        queryFn: () => api.post('/auth/refresh'),
        retry: false,
    });

    React.useEffect(() => {
        if (data) {
            setCredentials(data.data);
        }
    }, [data]);

    React.useEffect(() => {
        if (error?.status === 401) {
            setCredentials({
                accessToken: null,
                user: null,
            });
        }
    }, [error]);

    if (isFetching || accessToken === undefined) {
        return null;
    }

    if (accessToken === null) {
        return (
            <>
                {children}
                {auth}
            </>
        );
    }

    return (
        <>
            {children}
            {home}
        </>
    );
}
