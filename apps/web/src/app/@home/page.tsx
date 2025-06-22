import { DataTable } from '@/features/picking-slips/components/data-table';
import { api } from '@/lib/services/api';
import { getQueryClient } from '@/lib/utils/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

export default function PickingSlipsPage() {
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ['picking-slips'],
        queryFn: () => api.get('/picking-slips'),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DataTable />
        </HydrationBoundary>
    );
}
