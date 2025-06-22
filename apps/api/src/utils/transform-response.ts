import { PickingSlipResponse } from 'src/types/picking-slip';

export const transformPickingSlipResponse = (response: PickingSlipResponse) => ({
    order_id: response.orderId,
    picking_slip_id: response.pickingSlipId,
    picking_slip_status: response.pickingSlipStatus,
    has_pre_order_item: response.hasPreOrderItem,
});
