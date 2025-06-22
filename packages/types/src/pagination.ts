export const PAGE_DEFAULT = 1;
export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_MAX_DEFAULT = 100;

export const SORT = {
    ASC: 'asc',
    DESC: 'desc',
} as const;
export type Sort = (typeof SORT)[keyof typeof SORT];

export interface Pagination {
    page: number;
    pageSize: number;
}

export interface PaginatedResponse<T> extends Pagination {
    data: T[];
    total: number;
}
