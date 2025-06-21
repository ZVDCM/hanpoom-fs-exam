import { Inject, Injectable } from '@nestjs/common';
import { sql, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { PickingSlipDate } from 'src/picking-slips/domain/picking-slip-date';
import * as schema from 'src/picking-slips/schema';

@Injectable()
export class PickingSlipDatesRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async import(data: PickingSlipDate[]) {
        const commands: SQL[] = [];

        data.forEach((pickingSlipDate) => {
            const {
                id,
                pickingSlipId,
                printedUsername,
                inspectedUsername,
                packedUsername,
                shippedUsername,
                heldUsername,
                cancelledUsername,
                refundedUsername,
                confirmedUsername,
                printedAt,
                inspectedAt,
                packedAt,
                shippedAt,
                deliveredAt,
                returnedAt,
                cancelledAt,
                refundedAt,
                heldAt,
                confirmedAt,
                heldReason,
            } = pickingSlipDate;

            commands.push(sql`INSERT INTO ${schema.pickingSlipDates} (
                id, picking_slip_id, printed_username, inspected_username, packed_username, 
                shipped_username, held_username, cancelled_username, refunded_username, 
                confirmed_username, printed_at, inspected_at, packed_at, shipped_at, 
                delivered_at, returned_at, cancelled_at, refunded_at, held_at, confirmed_at, 
                held_reason
            ) OVERRIDING SYSTEM VALUE VALUES (
                ${id}, ${pickingSlipId}, ${printedUsername}, ${inspectedUsername}, ${packedUsername}, 
                ${shippedUsername}, ${heldUsername}, ${cancelledUsername}, ${refundedUsername}, 
                ${confirmedUsername}, ${printedAt}, ${inspectedAt}, 
                ${packedAt}, ${shippedAt}, 
                ${deliveredAt}, ${returnedAt}, 
                ${cancelledAt}, ${refundedAt}, 
                ${heldAt}, ${confirmedAt}, 
                ${heldReason}
            );`);
        });

        await this.database.transaction(async (tx) => {
            for (const command of commands) {
                await tx.execute(command);
            }
        });
    }
}
