import { AuthUser, LoginResponse } from '@repo/types';
import { create } from 'zustand';

interface UserState {
    user: AuthUser | null | undefined;
    accessToken: string | null | undefined;
}
interface UserActions {
    setCredentials: (data: UserState) => void;
}

type UserStore = UserState & UserActions;

export const userStore = create<UserStore>((set) => ({
    user: undefined,
    accessToken: undefined,
    setCredentials: (data: UserState) => set({ ...data }),
}));
