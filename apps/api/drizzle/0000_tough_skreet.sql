CREATE DOMAIN smallint_unsigned AS SMALLINT 
  CHECK (VALUE >= 0);

CREATE DOMAIN int_bool AS SMALLINT
  CHECK (VALUE IN (0, 1));

CREATE TABLE "picking_slip_dates" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "picking_slip_dates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"picking_slip_id" bigint NOT NULL,
	"printed_username" varchar(20),
	"inspected_username" varchar(20),
	"packed_username" varchar(20),
	"shipped_username" varchar(20),
	"held_username" varchar(20),
	"cancelled_username" varchar(20),
	"refunded_username" varchar(20),
	"confirmed_username" varchar(20),
	"printed_at" timestamp,
	"inspected_at" timestamp,
	"packed_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"returned_at" timestamp,
	"cancelled_at" timestamp,
	"refunded_at" timestamp,
	"held_at" timestamp,
	"confirmed_at" timestamp,
	"held_reason" varchar(20),
	CONSTRAINT "picking_slip_dates_picking_slip_id_unique" UNIQUE("picking_slip_id")
);
--> statement-breakpoint
CREATE TABLE "picking_slip_items" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "picking_slip_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"picking_slip_id" bigint NOT NULL,
	"item_id" bigint NOT NULL,
	"stock_id" bigint,
	"order_fulfillment_product_id" bigint NOT NULL,
	"quantity" smallint_unsigned NOT NULL,
	"refunded_quantity" smallint_unsigned DEFAULT 0 NOT NULL,
	"location_id" bigint,
	"location_code" varchar(20),
	"is_pre_order" "int_bool" DEFAULT 0,
	"is_sales_only" "int_bool" DEFAULT 0,
	"pre_order_shipping_at" timestamp,
	"pre_order_deadline_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "picking_slips" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "picking_slips_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" bigint NOT NULL,
	"order_fulfillment_order_id" bigint NOT NULL,
	"is_contained_single_product" "int_bool" DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
