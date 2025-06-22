import { AggregateRoot } from '@nestjs/cqrs';

export class PickingSlipItem extends AggregateRoot {
    constructor(
        private readonly _id: number,
        private readonly _pickingSlipId: number,
        private readonly _itemId: number,
        private readonly _quantity: number,
        private readonly _orderFulfillmentProductId: number,
        private readonly _stockId: number,
        private readonly _refundedQuantity: number,
        private readonly _locationId: number,
        private readonly _locationCode: string,
        private readonly _isPreOrder: number,
        private readonly _isSalesOnly: number,
        private readonly _preOrderShippingAt: Date,
        private readonly _preOrderDeadlineAt: Date,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get pickingSlipId() {
        return this._pickingSlipId;
    }
    get itemId() {
        return this._itemId;
    }
    get quantity() {
        return this._quantity;
    }
    get orderFulfillmentProductId() {
        return this._orderFulfillmentProductId;
    }
    get stockId() {
        return this._stockId;
    }
    get refundedQuantity() {
        return this._refundedQuantity;
    }
    get locationId() {
        return this._locationId;
    }
    get locationCode() {
        return this._locationCode;
    }
    get isPreOrder() {
        return this._isPreOrder;
    }
    get isSalesOnly() {
        return this._isSalesOnly;
    }
    get preOrderShippingAt() {
        return this._preOrderShippingAt;
    }
    get preOrderDeadlineAt() {
        return this._preOrderDeadlineAt;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
}
