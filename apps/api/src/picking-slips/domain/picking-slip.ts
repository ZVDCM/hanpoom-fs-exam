import { AggregateRoot } from '@nestjs/cqrs';
import { PickingSlipId } from '@repo/types';

export class PickingSlip extends AggregateRoot {
    constructor(
        private readonly _id: PickingSlipId,
        private readonly _orderId: number,
        private readonly _orderFulfillmentOrderId: number,
        private readonly _isContainedSingleProduct: boolean,
        private readonly _createdAt: Date,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get orderId() {
        return this._orderId;
    }
    get orderFulfillmentOrderId() {
        return this._orderFulfillmentOrderId;
    }
    get isContainedSingleProduct() {
        return this._isContainedSingleProduct;
    }
    get createdAt() {
        return this._createdAt;
    }
}
