import { AuthUser, LoginResponse } from '@repo/types';
import { create } from 'zustand';

interface UserState {
    user: AuthUser | null | undefined;
    accessToken: string | null | undefined;
    setCredentials: (data: LoginResponse) => void;
}

export const userStore = create<UserState>((set) => ({
    user: undefined,
    accessToken: undefined,
    setCredentials: (data: LoginResponse) => set({ ...data }),
}));
