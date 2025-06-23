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
import { Input } from '@/components/ui/input';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import Link from 'next/link';
import { api } from '@/lib/services/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ErrorMessage } from '@repo/types';
import { useRouter } from 'next/navigation';

export const signUpSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SignUpType = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const router = useRouter();

    const { mutate, isSuccess, isPending, error } = useMutation<
        void,
        AxiosError<ErrorMessage>,
        SignUpType
    >({
        mutationFn: (data: SignUpType) => api.post('/auth/register', data),
    });

    const form = useForm<SignUpType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        disabled: isPending,
    });

    const onSubmit = (data: SignUpType) => {
        mutate(data);
    };

    React.useEffect(() => {
        if (error) {
            toast.error('Create Unsuccessful', {
                description: error?.response?.data.message,
            });
        }
    }, [error]);

    React.useEffect(() => {
        if (isSuccess) {
            toast.success('Create Successful', {
                description: 'You may now log in',
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
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
                    Sign Up
                </Button>
            </CardFooter>
        </Card>
    );
}
