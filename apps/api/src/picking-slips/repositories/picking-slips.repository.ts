import { Inject, Injectable } from '@nestjs/common';
import { sql, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { PickingSlip } from 'src/picking-slips/domain/picking-slip';
import * as schema from 'src/picking-slips/schema';

@Injectable()
export class PickingSlipsRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async import(data: PickingSlip[]) {
        const commands: SQL[] = [];

        data.forEach((pickingSlip) => {
            const { id, orderId, orderFulfillmentOrderId, isContainedSingleProduct, createdAt } =
                pickingSlip;
            commands.push(sql`INSERT INTO ${schema.pickingSlips} (id, order_id, order_fulfillment_order_id, is_contained_single_product, created_at) OVERRIDING SYSTEM VALUE
                           VALUES (${id}, ${orderId}, ${orderFulfillmentOrderId}, ${isContainedSingleProduct}, ${createdAt});`);
        });

        await this.database.transaction(async (tx) => {
            for (const command of commands) {
                await tx.execute(command);
            }
        });
    }
}
