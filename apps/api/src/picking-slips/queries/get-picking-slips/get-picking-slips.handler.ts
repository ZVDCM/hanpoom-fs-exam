import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedResponse, PickingSlip, PickingSlipStatus } from '@repo/types';
import { and, asc, desc, eq, SQL, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { GetPickingSlipsQuery } from 'src/picking-slips/queries/get-picking-slips/get-picking-slips.query';
import * as schema from 'src/picking-slips/schema';
import { checkForErrors } from 'src/utils/check-for-errors';
import { getValues } from 'src/utils/get-values';
import { toSnakeCase } from 'src/utils/to-snake-case';

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
    }: GetPickingSlipsQuery): Promise<PaginatedResponse<PickingSlip>> {
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
                    WHEN ${schema.pickingSlipDates.printedAt} IS NOT NULL
                        THEN 'printed'
                    WHEN ${schema.pickingSlipDates.heldAt} IS NOT NULL
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

        const baseQuery = this.database.$with('pickingSlips').as(
            this.database
                .with(pickingSlipItems, pickingSlipDates)
                .select({
                    pickingSlipId: schema.pickingSlips.id,
                    orderId: schema.pickingSlips.orderId,
                    pickingSlipStatus: pickingSlipDates.pickingSlipStatus,
                    hasPreOrderItem: pickingSlipItems.hasPreOrderItem,
                })
                .from(schema.pickingSlips)
                .leftJoin(
                    pickingSlipItems,
                    eq(schema.pickingSlips.id, pickingSlipItems.pickingSlipId),
                )
                .leftJoin(
                    pickingSlipDates,
                    eq(schema.pickingSlips.id, pickingSlipDates.pickingSlipId),
                )
                .where(and(...conditions))
                .orderBy(order),
        );

        const offset = Math.max(0, page - 1) * pageSize;

        const results = await Promise.allSettled([
            this.database.$count(this.database.with(baseQuery).select().from(baseQuery)),
            this.database.with(baseQuery).select().from(baseQuery).limit(pageSize).offset(offset),
        ]);

        checkForErrors(results);

        const [count, pickingSlips] = getValues(results) as [number, PickingSlip[]];

        const data = pickingSlips.map(
            (pickingSlip) =>
                ({
                    ...pickingSlip,
                    pickingSlipStatus: pickingSlip.pickingSlipStatus as PickingSlipStatus,
                    hasPreOrderItem: pickingSlip.hasPreOrderItem as boolean,
                }) as const satisfies PickingSlip,
        );

        return {
            data: toSnakeCase(data),
            total: count,
            page,
            pageSize,
        };
    }
}
