import { AggregateRoot } from '@nestjs/cqrs';

export class PickingSlipItem extends AggregateRoot {
    constructor(
        public readonly id: number,
        public readonly pickingSlipId: number,
        public readonly itemId: number,
        public readonly quantity: number,
        public readonly orderFulfillmentProductId: number,
        public readonly stockId: number,
        public readonly refundedQuantity: number,
        public readonly locationId: number,
        public readonly locationCode: string,
        public readonly isPreOrder: number,
        public readonly isSalesOnly: number,
        public readonly preOrderShippingAt: Date,
        public readonly preOrderDeadlineAt: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        super();
    }
}
