import { PickingSlipId } from 'src/picking-slips/schema';

export const PICKING_SLIP_STATUS = {
    PRINTED: 'printed',
    NOT_PRINTED: 'not_printed',
    HELD: 'held',
} as const;
export type PickingSlipStatus = (typeof PICKING_SLIP_STATUS)[keyof typeof PICKING_SLIP_STATUS];

export interface PickingSlipResponse {
    pickingSlipId: PickingSlipId;
    orderId: number;
    pickingSlipStatus: PickingSlipStatus;
    hasPreOrderItem: boolean;
}
