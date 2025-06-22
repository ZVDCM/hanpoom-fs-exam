export type PickingSlipId = number & { __brand: 'picking_slip_id' };
export type PickingSlipItemId = number & { __brand: 'picking_slip_item_id' };
export type PickingSlipDateId = number & { __brand: 'picking_slip_date_id' };

export const PICKING_SLIP_STATUS = {
    PRINTED: 'printed',
    NOT_PRINTED: 'not_printed',
    HELD: 'held',
} as const;
export type PickingSlipStatus = (typeof PICKING_SLIP_STATUS)[keyof typeof PICKING_SLIP_STATUS];

export interface PickingSlip {
    pickingSlipId: PickingSlipId;
    orderId: number;
    pickingSlipStatus: PickingSlipStatus;
    hasPreOrderItem: boolean;
}
