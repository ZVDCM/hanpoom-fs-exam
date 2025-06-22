import { z } from 'zod';
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX_DEFAULT, SORT } from './pagination';
import { PICKING_SLIP_STATUS } from './picking-slip';
import { zodEnum } from './utils';

const pickingSlipStatuses = Object.values(PICKING_SLIP_STATUS);
const sorts = Object.values(SORT);

export const querySchema = z.object({
    status: z.enum(zodEnum(pickingSlipStatuses)).optional(),
    sort: z.enum(zodEnum(sorts)).default('desc'),
    page: z.coerce.number().int().min(1).default(PAGE_DEFAULT),
    pageSize: z.coerce.number().int().min(1).max(PAGE_SIZE_MAX_DEFAULT).default(PAGE_SIZE_DEFAULT),
});

export type QueryType = z.infer<typeof querySchema>;
