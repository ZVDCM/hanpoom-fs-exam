import { AggregateRoot } from '@nestjs/cqrs';

export class PickingSlipDate extends AggregateRoot {
    constructor(
        public readonly id: number,
        public readonly pickingSlipId: number,
        public readonly printedUsername: string,
        public readonly inspectedUsername: string,
        public readonly packedUsername: string,
        public readonly shippedUsername: string,
        public readonly heldUsername: string,
        public readonly cancelledUsername: string,
        public readonly refundedUsername: string,
        public readonly confirmedUsername: string,
        public readonly printedAt: Date,
        public readonly inspectedAt: Date,
        public readonly packedAt: Date,
        public readonly shippedAt: Date,
        public readonly deliveredAt: Date,
        public readonly returnedAt: Date,
        public readonly cancelledAt: Date,
        public readonly refundedAt: Date,
        public readonly heldAt: Date,
        public readonly confirmedAt: Date,
        public readonly heldReason: string,
    ) {
        super();
    }
}
