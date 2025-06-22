import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, asc, desc, eq, SQL, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { GetPickingSlipsQuery } from 'src/picking-slips/queries/get-picking-slips/get-picking-slips.query';
import * as schema from 'src/picking-slips/schema';
import { PickingSlipResponse, PickingSlipStatus } from 'src/types/picking-slip';

@QueryHandler(GetPickingSlipsQuery)
export class GetPickingSlipsHandler implements IQueryHandler<GetPickingSlipsQuery> {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async execute({
        sort,
        status,
        page,
        pageSize,
    }: GetPickingSlipsQuery): Promise<PickingSlipResponse[]> {
        const pickingSlipItems = this.database.$with('pickingSlipItems').as(
            this.database
                .select({
                    pickingSlipId: schema.pickingSlipItems.pickingSlipId,
                    hasPreOrderItem: sql`SUM(${schema.pickingSlipItems.isPreOrder}) > 0`.as(
                        'hasPreOrderItem',
                    ),
                })
                .from(schema.pickingSlipItems)
                .groupBy(schema.pickingSlipItems.pickingSlipId),
        );

        const statusColumn = sql`
                CASE
                    WHEN printed_at IS NOT NULL
                        THEN 'printed'
                    WHEN held_at IS NOT NULL
                        THEN 'held'
                    ELSE 'not_printed'
                END
            `.as('status');

        const pickingSlipDates = this.database.$with('pickingSlipDates').as(
            this.database
                .select({
                    pickingSlipId: schema.pickingSlipDates.pickingSlipId,
                    pickingSlipStatus: statusColumn,
                })
                .from(schema.pickingSlipDates),
        );

        const conditions: SQL[] = [];
        if (status) {
            conditions.push(eq(pickingSlipDates.pickingSlipStatus, status));
        }

        const order: SQL =
            sort === 'asc'
                ? asc(schema.pickingSlips.createdAt)
                : desc(schema.pickingSlips.createdAt);

        const offset = Math.max(0, page - 1) * pageSize;

        const pickingSlips = await this.database
            .with(pickingSlipItems, pickingSlipDates)
            .select({
                pickingSlipId: schema.pickingSlips.id,
                orderId: schema.pickingSlips.orderId,
                pickingSlipStatus: pickingSlipDates.pickingSlipStatus,
                hasPreOrderItem: pickingSlipItems.hasPreOrderItem,
            })
            .from(schema.pickingSlips)
            .leftJoin(pickingSlipItems, eq(schema.pickingSlips.id, pickingSlipItems.pickingSlipId))
            .leftJoin(pickingSlipDates, eq(schema.pickingSlips.id, pickingSlipDates.pickingSlipId))
            .where(and(...conditions))
            .orderBy(order)
            .limit(pageSize)
            .offset(offset);

        return pickingSlips.map(
            (pickingSlip) =>
                ({
                    ...pickingSlip,
                    pickingSlipStatus: pickingSlip.pickingSlipStatus as PickingSlipStatus,
                    hasPreOrderItem: pickingSlip.hasPreOrderItem as boolean,
                }) as const satisfies PickingSlipResponse,
        );
    }
}
