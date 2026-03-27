import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Better Auth Schema Requirements
export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	role: text("role").default("user").notNull(),
	handle: text("handle"),
	specialty: text("specialty"),
	dateStarted: text("dateStarted"),
	bio: text("bio"),
	philosophy: text("philosophy"),
	requiresPasswordReset: integer("requiresPasswordReset", { mode: "boolean" }).default(false).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const passkey = sqliteTable("passkey", {
	id: text("id").primaryKey(),
	name: text("name"),
	publicKey: text("publicKey").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	credentialID: text("credentialID").notNull(),
	counter: integer("counter").notNull(),
	deviceType: text("deviceType").notNull(),
	backedUp: integer("backedUp", { mode: "boolean" }).notNull(),
	transports: text("transports"),
	createdAt: integer("createdAt", { mode: "timestamp" }),
	aaguid: text("aaguid")
});

// App Custom Schema
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  type: text("type").notNull(), // e.g., 'wedding', 'corporate'
  date: text("date"),
  details: text("details").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'accepted', 'declined'
  images: text("images"), // JSON string array of URLs
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'van_location'
  value: text("value").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const gallery = sqliteTable("gallery", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  altText: text("altText").notNull(),
  description: text("description"),
  artistId: text("artistId").notNull().references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

export const pricingCategories = sqliteTable("pricing_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'studio' | 'mobile'
  order: integer("order").default(0).notNull(),
});

export const pricingItems = sqliteTable("pricing_items", {
  id: text("id").primaryKey(),
  categoryId: text("categoryId").notNull().references(() => pricingCategories.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(), // e.g. "£100" or "Starts at £50"
  image: text("image"),
  isLimited: integer("isLimited", { mode: "boolean" }).default(false).notNull(),
  order: integer("order").default(0).notNull(),
});

export const pricingAddons = sqliteTable("pricing_addons", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  image: text("image"),
});

export const categoryToAddons = sqliteTable("category_to_addons", {
  categoryId: text("categoryId").notNull().references(() => pricingCategories.id, { onDelete: 'cascade' }),
  addonId: text("addonId").notNull().references(() => pricingAddons.id, { onDelete: 'cascade' }),
});
