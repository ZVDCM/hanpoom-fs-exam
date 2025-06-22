import Logout from '@/components/layouts/logout';
import React from 'react';

export default function PickingSlipsLayout({ children }: Readonly<React.PropsWithChildren>) {
    return (
        <main className="flex justify-center items-center">
            <Logout />
            {children}
        </main>
    );
}
