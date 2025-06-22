import {
    PAGE_DEFAULT,
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_MAX_DEFAULT,
    PICKING_SLIP_STATUS,
    SORT,
} from '@repo/types';
import { createZodDto } from 'nestjs-zod';
import { zodEnum } from 'src/utils/zod-enum';
import { z } from 'zod';

const pickingSlipStatuses = Object.values(PICKING_SLIP_STATUS);
const sorts = Object.values(SORT);

const querySchema = z.object({
    status: z.enum(zodEnum(pickingSlipStatuses)).optional(),
    sort: z.enum(zodEnum(sorts)).default('desc'),
    page: z.coerce.number().int().min(1).default(PAGE_DEFAULT),
    pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX_DEFAULT).default(PAGE_SIZE_DEFAULT),
});

export type QueryDtoType = z.infer<typeof querySchema>;

export class QueryDto extends createZodDto(querySchema) {}
