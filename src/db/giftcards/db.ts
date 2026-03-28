import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'node:path';

const dbFile = path.resolve(process.cwd(), 'giftcards.db');
const sqlite = new Database(dbFile);

// Create tables if they don't exist (basic auto-migration as requested for a simple setup)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS gift_cards (
    id TEXT PRIMARY KEY,
    pin TEXT NOT NULL,
    initial_amount INTEGER NOT NULL,
    current_balance INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS gift_card_transactions (
    id TEXT PRIMARY KEY,
    gift_card_id TEXT NOT NULL REFERENCES gift_cards(id),
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL
  );
`);

export const giftCardDb = drizzle(sqlite, { schema });
