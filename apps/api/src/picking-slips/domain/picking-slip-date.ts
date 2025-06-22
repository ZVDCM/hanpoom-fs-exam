import { AggregateRoot } from '@nestjs/cqrs';

export class PickingSlipDate extends AggregateRoot {
    constructor(
        private readonly _id: number,
        private readonly _pickingSlipId: number,
        private readonly _printedUsername: string,
        private readonly _inspectedUsername: string,
        private readonly _packedUsername: string,
        private readonly _shippedUsername: string,
        private readonly _heldUsername: string,
        private readonly _cancelledUsername: string,
        private readonly _refundedUsername: string,
        private readonly _confirmedUsername: string,
        private readonly _printedAt: Date,
        private readonly _inspectedAt: Date,
        private readonly _packedAt: Date,
        private readonly _shippedAt: Date,
        private readonly _deliveredAt: Date,
        private readonly _returnedAt: Date,
        private readonly _cancelledAt: Date,
        private readonly _refundedAt: Date,
        private readonly _heldAt: Date,
        private readonly _confirmedAt: Date,
        private readonly _heldReason: string,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get pickingSlipId() {
        return this._pickingSlipId;
    }
    get printedUsername() {
        return this._printedUsername;
    }
    get inspectedUsername() {
        return this._inspectedUsername;
    }
    get packedUsername() {
        return this._packedUsername;
    }
    get shippedUsername() {
        return this._shippedUsername;
    }
    get heldUsername() {
        return this._heldUsername;
    }
    get cancelledUsername() {
        return this._cancelledUsername;
    }
    get refundedUsername() {
        return this._refundedUsername;
    }
    get confirmedUsername() {
        return this._confirmedUsername;
    }
    get printedAt() {
        return this._printedAt;
    }
    get inspectedAt() {
        return this._inspectedAt;
    }
    get packedAt() {
        return this._packedAt;
    }
    get shippedAt() {
        return this._shippedAt;
    }
    get deliveredAt() {
        return this._deliveredAt;
    }
    get returnedAt() {
        return this._returnedAt;
    }
    get cancelledAt() {
        return this._cancelledAt;
    }
    get refundedAt() {
        return this._refundedAt;
    }
    get heldAt() {
        return this._heldAt;
    }
    get confirmedAt() {
        return this._confirmedAt;
    }
    get heldReason() {
        return this._heldReason;
    }
}
