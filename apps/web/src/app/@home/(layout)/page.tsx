import Link from 'next/link';
import React from 'react';

export default function HomePage() {
    return (
        <h1>
            Hello, Welcome. Go to <Link href="/picking-slips" className='underline'>Picking Slips</Link>
        </h1>
    );
}
