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
    PAGE_DEFAULT,
    PAGE_SIZE_DEFAULT,
    PaginatedResponse,
    Pagination,
    PICKING_SLIP_STATUS,
    PickingSlipResponse,
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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useDebounce from '@/features/picking-slips/hooks/use-debounce';

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
    const [pagination, setPagination] = React.useState<Pagination>({
        page: PAGE_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
    });
    const debouncedPagination = useDebounce(pagination, 500);
    const [status, setStatus] = React.useState('');

    const { data } = useSuspenseQuery<AxiosResponse<PaginatedResponse<PickingSlipResponse>>>({
        queryKey: ['picking-slips', status, debouncedPagination.page, debouncedPagination.pageSize],
        queryFn: () => {
            return api.get(`/picking-slips`, {
                params: {
                    status: status !== '' ? status : undefined,
                    page: debouncedPagination.page,
                    pageSize: Math.max(1, debouncedPagination.pageSize),
                },
            });
        },
    });

    console.log(data.data);

    const maxPage = React.useMemo(
        () => Math.ceil(data.data.total / data.data.pageSize),
        [data.data.pageSize, data.data.total],
    );

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
            <div className="flex justify-between">
                <Input
                    placeholder={`${PAGE_SIZE_DEFAULT}`}
                    className="w-[80px]"
                    defaultValue={pagination.pageSize}
                    onChange={(e) =>
                        setPagination((prev) => ({ ...prev, pageSize: Number(e.target.value) }))
                    }
                />
                <div className="flex gap-4">
                    <Button
                        onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
                        disabled={pagination.page - 1 <= 0}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page - 1 <= 0}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page + 1 >= maxPage}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        onClick={() => setPagination((prev) => ({ ...prev, page: maxPage }))}
                        disabled={pagination.page + 1 >= maxPage}
                    >
                        <ChevronsRight />
                    </Button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {pagination.page} of {maxPage}
                        </strong>
                    </span>
                </div>
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
            </div>
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
