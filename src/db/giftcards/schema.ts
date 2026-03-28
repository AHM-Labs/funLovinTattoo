import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const giftCards = sqliteTable('gift_cards', {
  id: text('id').primaryKey(), // e.g. FLT-ABCD-1234
  pin: text('pin').notNull(),  // 4-digit numeric string
  initialAmount: integer('initial_amount').notNull(), // in cents/pence
  currentBalance: integer('current_balance').notNull(), // in cents/pence
  status: text('status', { enum: ['active', 'disabled'] }).default('active').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const giftCardTransactions = sqliteTable('gift_card_transactions', {
  id: text('id').primaryKey(), // UUID
  giftCardId: text('gift_card_id').notNull().references(() => giftCards.id),
  amount: integer('amount').notNull(), // in cents/pence (negative for redemption, positive for load)
  type: text('type', { enum: ['issue', 'redemption', 'adjustment'] }).notNull(),
  description: text('description'), // e.g., 'Booking #123'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
