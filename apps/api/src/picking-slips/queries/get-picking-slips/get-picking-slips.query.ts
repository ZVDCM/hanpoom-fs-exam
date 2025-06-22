import { Query } from '@nestjs/cqrs';
import {
    PAGE_DEFAULT,
    PAGE_SIZE_DEFAULT,
    PaginatedResponse,
    PickingSlip,
    SORT,
    Sort,
} from '@repo/types';

export class GetPickingSlipsQuery extends Query<PaginatedResponse<PickingSlip>> {
    constructor(
        public readonly status?: string,
        public readonly sort: Sort = SORT.DESC,
        public readonly page: number = PAGE_DEFAULT,
        public readonly pageSize: number = PAGE_SIZE_DEFAULT,
    ) {
        super();
    }
}
