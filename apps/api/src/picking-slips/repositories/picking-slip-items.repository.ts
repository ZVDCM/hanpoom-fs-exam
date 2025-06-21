import { Inject, Injectable } from '@nestjs/common';
import { sql, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { PickingSlipItem } from 'src/picking-slips/domain/picking-slip-item';
import * as schema from 'src/picking-slips/schema';

@Injectable()
export class PickingSlipItemsRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async import(data: PickingSlipItem[]) {
        const commands: SQL[] = [];

        data.forEach((pickingSlip) => {
            const {
                id,
                pickingSlipId,
                itemId,
                quantity,
                orderFulfillmentProductId,
                stockId,
                refundedQuantity,
                locationId,
                locationCode,
                isPreOrder,
                isSalesOnly,
                preOrderShippingAt,
                preOrderDeadlineAt,
                createdAt,
                updatedAt,
            } = pickingSlip;
            commands.push(sql`INSERT INTO ${schema.pickingSlipItems} (
                id, picking_slip_id, item_id, quantity, order_fulfillment_product_id, stock_id, 
                refunded_quantity, location_id, location_code, is_pre_order, is_sales_only, 
                pre_order_shipping_at, pre_order_deadline_at, created_at, updated_at
            ) OVERRIDING SYSTEM VALUE VALUES (
                ${id}, ${pickingSlipId}, ${itemId}, ${quantity}, ${orderFulfillmentProductId}, 
                ${stockId}, ${refundedQuantity}, ${locationId}, ${locationCode}, 
                ${isPreOrder}, ${isSalesOnly}, ${preOrderShippingAt}, ${preOrderDeadlineAt}, 
                ${createdAt}, ${updatedAt}
            );`);
        });

        await this.database.transaction(async (tx) => {
            for (const command of commands) {
                await tx.execute(command);
            }
        });
    }
}
