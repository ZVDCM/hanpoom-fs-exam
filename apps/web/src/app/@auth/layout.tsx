import React from 'react';

export default function AuthLayout({ children }: Readonly<React.PropsWithChildren>) {
    return <main className="flex justify-center items-center">{children}</main>;
}
