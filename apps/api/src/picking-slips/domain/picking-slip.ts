import { AggregateRoot } from '@nestjs/cqrs';

export class PickingSlip extends AggregateRoot {
    constructor(
        public readonly id: number,
        public readonly orderId: number,
        public readonly orderFulfillmentOrderId: number,
        public readonly isContainedSingleProduct: boolean,
        public readonly createdAt: Date,
    ) {
        super();
    }
}
