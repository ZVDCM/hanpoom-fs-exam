'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    PaginatedResponse,
    PICKING_SLIP_STATUS,
    PickingSlipResponse,
    PickingSlipStatus,
} from '@repo/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { api } from '@/lib/services/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import React from 'react';

const STATUSES = Object.values(PICKING_SLIP_STATUS);

export const columns: ColumnDef<PickingSlipResponse>[] = [
    {
        accessorKey: 'picking_slip_id',
        header: 'Id',
    },
    {
        accessorKey: 'order_id',
        header: 'Order Id',
    },
    {
        accessorKey: 'has_pre_order_item',
        header: 'Has Pre-Order Item',
    },
    {
        accessorKey: 'picking_slip_status',
        header: 'Status',
    },
];

export function DataTable() {
    const [status, setStatus] = React.useState('');

    const { data } = useSuspenseQuery<AxiosResponse<PaginatedResponse<PickingSlipResponse>>>({
        queryKey: ['picking-slips', status],
        queryFn: () => {
            return api.get(`/picking-slips`, {
                params: {
                    status: status !== '' ? status : undefined,
                },
            });
        },
    });

    const slips = data.data.data;

    const table = useReactTable({
        data: slips,
        columns,
        manualPagination: true,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px] self-end">
                    <SelectValue placeholder="Picking Slip Status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="rounded-md border w-[700px]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
