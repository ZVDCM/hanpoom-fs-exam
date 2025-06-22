import { Query } from '@nestjs/cqrs';
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, SORT, Sort } from 'src/picking-slips/dto/query.dto';
import { PickingSlipResponse } from 'src/types/picking-slip';

export class GetPickingSlipsQuery extends Query<PickingSlipResponse[]> {
    constructor(
        public readonly status?: string,
        public readonly sort: Sort = SORT.DESC,
        public readonly page: number = PAGE_DEFAULT,
        public readonly pageSize: number = PAGE_SIZE_DEFAULT,
    ) {
        super();
    }
}
