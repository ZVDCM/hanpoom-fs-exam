import { relations } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, bigint, smallint } from 'drizzle-orm/pg-core';

const intBool = customType<{ data: number; notNull: true; default: true }>({
    dataType() {
        return 'int_bool';
    },
});
const smallintUnsigned = customType<{ data: number; notNull: true; default: true }>({
    dataType() {
        return 'smallint_unsigned';
    },
});

export type PickingSlipId = number & { __brand: 'picking_slip_id' };
export type PickingSlipItemId = number & { __brand: 'picking_slip_item_id' };
export type PickingSlipDateId = number & { __brand: 'picking_slip_date_id' };

export const pickingSlips = pgTable('picking_slips', {
    id: bigint('id', { mode: 'number' })
        .$type<PickingSlipId>()
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    orderId: bigint('order_id', { mode: 'number' }).notNull(),
    orderFulfillmentOrderId: bigint('order_fulfillment_order_id', { mode: 'number' }).notNull(),
    isContainedSingleProduct: intBool('is_contained_single_product').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

export const pickingSlipDates = pgTable('picking_slip_dates', {
    id: bigint('id', { mode: 'number' })
        .$type<PickingSlipDateId>()
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    pickingSlipId: bigint('picking_slip_id', { mode: 'number' }).notNull().unique(),
    printedUsername: varchar('printed_username', { length: 20 }),
    inspectedUsername: varchar('inspected_username', { length: 20 }),
    packedUsername: varchar('packed_username', { length: 20 }),
    shippedUsername: varchar('shipped_username', { length: 20 }),
    heldUsername: varchar('held_username', { length: 20 }),
    cancelledUsername: varchar('cancelled_username', { length: 20 }),
    refundedUsername: varchar('refunded_username', { length: 20 }),
    confirmedUsername: varchar('confirmed_username', { length: 20 }),
    printedAt: timestamp('printed_at'),
    inspectedAt: timestamp('inspected_at'),
    packedAt: timestamp('packed_at'),
    shippedAt: timestamp('shipped_at'),
    deliveredAt: timestamp('delivered_at'),
    returnedAt: timestamp('returned_at'),
    cancelledAt: timestamp('cancelled_at'),
    refundedAt: timestamp('refunded_at'),
    heldAt: timestamp('held_at'),
    confirmedAt: timestamp('confirmed_at'),
    heldReason: varchar('held_reason', { length: 20 }),
});

export const pickingSlipItems = pgTable('picking_slip_items', {
    id: bigint('id', { mode: 'number' })
        .$type<PickingSlipItemId>()
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    pickingSlipId: bigint('picking_slip_id', { mode: 'number' }).notNull(),
    itemId: bigint('item_id', { mode: 'number' }).notNull(),
    stockId: bigint('stock_id', { mode: 'number' }),
    orderFulfillmentProductId: bigint('order_fulfillment_product_id', { mode: 'number' }).notNull(),
    quantity: smallintUnsigned('quantity'),
    refundedQuantity: smallintUnsigned('refunded_quantity').notNull().default(0),
    locationId: bigint('location_id', { mode: 'number' }),
    locationCode: varchar('location_code', { length: 20 }),
    isPreOrder: intBool('is_pre_order').default(0),
    isSalesOnly: intBool('is_sales_only').default(0),
    preOrderShippingAt: timestamp('pre_order_shipping_at'),
    preOrderDeadlineAt: timestamp('pre_order_deadline_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const pickingSlipsRelations = relations(pickingSlips, ({ one, many }) => ({
    dates: one(pickingSlipDates, {
        fields: [pickingSlips.id],
        references: [pickingSlipDates.pickingSlipId],
    }),
    items: many(pickingSlipItems),
}));
