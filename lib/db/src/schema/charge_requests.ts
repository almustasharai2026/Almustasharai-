import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chargeRequestsTable = pgTable("charge_requests", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  user_name: text("user_name").notNull(),
  user_phone: text("user_phone").notNull(),
  package_name: text("package_name").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  note: text("note"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChargeRequestSchema = createInsertSchema(chargeRequestsTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertChargeRequest = z.infer<typeof insertChargeRequestSchema>;
export type ChargeRequest = typeof chargeRequestsTable.$inferSelect;
