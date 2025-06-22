import { createZodDto } from 'nestjs-zod';
import { PICKING_SLIP_STATUS } from 'src/types/picking-slip';
import { zodEnum } from 'src/utils/zod-enum';
import { z } from 'zod';

export const PAGE_DEFAULT = 1;
export const PAGE_SIZE_DEFAULT = 10;

export const SORT = {
    ASC: 'asc',
    DESC: 'desc',
} as const;
export type Sort = (typeof SORT)[keyof typeof SORT];

const pickingSlipStatuses = Object.values(PICKING_SLIP_STATUS);
const sorts = Object.values(SORT);

const querySchema = z.object({
    status: z.enum(zodEnum(pickingSlipStatuses)).optional(),
    sort: z.enum(zodEnum(sorts)).default('desc'),
    page: z.coerce.number().int().min(1).default(PAGE_DEFAULT),
    pageSize: z.coerce.number().int().min(1).max(100).default(PAGE_SIZE_DEFAULT),
});

export type QueryDtoType = z.infer<typeof querySchema>;

export class QueryDto extends createZodDto(querySchema) {}
