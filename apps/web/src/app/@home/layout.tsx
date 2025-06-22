import Logout from '@/components/layouts/logout';
import React from 'react';

export default function PickingSlipsLayout({ children }: Readonly<React.PropsWithChildren>) {
    return (
        <main className="flex flex-col justify-center items-center pt-[5rem] pb-[10rem]">
            <Logout />
            {children}
        </main>
    );
}
