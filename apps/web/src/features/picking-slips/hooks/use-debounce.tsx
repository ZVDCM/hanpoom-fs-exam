'use client';

import React from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = React.useState(value);

    React.useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
}
