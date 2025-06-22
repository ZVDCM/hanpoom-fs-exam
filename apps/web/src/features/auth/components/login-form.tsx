'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/services/api';
import { userStore } from '@/lib/stores/user-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage, LoginResponse } from '@repo/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export type LoginType = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const { setCredentials } = userStore();

    const router = useRouter();

    const { mutate, isSuccess, isPending, isError } = useMutation<
        AxiosResponse<LoginResponse>,
        AxiosError<ErrorMessage>,
        LoginType
    >({
        mutationFn: (data: LoginType) => api.post('/auth/login', data),
        onSuccess: (data) => setCredentials(data.data),
    });

    const form = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        disabled: isPending,
    });

    const onSubmit = (data: LoginType) => {
        mutate(data);
    };

    React.useEffect(() => {
        if (isError) {
            toast.error('Invalid Credentials', {
                description: 'Email or Password may be invalid',
            });
        }
    }, [isError]);

    React.useEffect(() => {
        if (isSuccess) {
            toast.success('Login Successful', {
                description: 'Welcome back!',
            });
            router.push('/');
        }
    }, [isSuccess, router]);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                    Enter your credentials below to create your account
                </CardDescription>
                <CardAction>
                    <Link href="/" passHref>
                        <Button variant="link">Login</Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="email"
                                                placeholder="juan.delacruz@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <button
                            type="submit"
                            className="sr-only"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isPending}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    type="submit"
                    className="w-full"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isPending}
                >
                    Log in
                </Button>
            </CardFooter>
        </Card>
    );
}
