import { auth } from "../lib/auth";
import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";
import * as dotenv from 'dotenv';
import { pricingCategories, pricingItems, pricingAddons, categoryToAddons } from "./schema";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

async function seed() {
    console.log("🌱 Seeding initial admin user and pricing data...");
    
    // ... (rest of admin user logic stays same or modified slightly)
    const email = "aaron@ahm-labs.com";
    const password = "password";

    try {
        // 1. Admin User logic
        const result = await auth.api.signUpEmail({
            body: { email, password, name: "Aaron Admin" }
        });
        const userId = result.user.id;
        await db.update(user).set({ role: "admin", requiresPasswordReset: true }).where(eq(user.id, userId));
    } catch (e: any) {
         if (!e.message?.includes("already exists")) console.log("Admin skip/fail:", e.message);
    }

    // 2. Pricing Categories
    console.log("📦 Seeding categories...");
    const studioCatId = uuidv4();
    const flashCatId = uuidv4();
    const weddingCatId = uuidv4();
    const eventCatId = uuidv4();

    await db.insert(pricingCategories).values([
        { id: studioCatId, name: "Studio Sessions", type: "studio", order: 1 },
        { id: flashCatId, name: "Flash Tattoos", type: "studio", order: 2 },
        { id: weddingCatId, name: "Weddings (Van)", type: "mobile", order: 1 },
        { id: eventCatId, name: "Corporate & Events", type: "mobile", order: 2 },
    ]).onConflictDoNothing();

    // 3. Addons
    console.log("➕ Seeding addons...");
    const numbingId = uuidv4();
    const garlandId = uuidv4();

    await db.insert(pricingAddons).values([
        { id: numbingId, name: "Numbing Treatment", description: "Premium numbing cream for long sessions.", price: "£25" },
        { id: garlandId, name: "Extra Garlands", description: "Seasonal floral decorations for the van.", price: "£75" },
    ]).onConflictDoNothing();

    // 4. Link Addons to Categories
    await db.insert(categoryToAddons).values([
        { categoryId: studioCatId, addonId: numbingId },
        { categoryId: weddingCatId, addonId: garlandId },
    ]).onConflictDoNothing();

    // 5. Pricing Items
    console.log("🏷️ Seeding items...");
    await db.insert(pricingItems).values([
        { id: uuidv4(), categoryId: studioCatId, name: "Full Day Session", description: "7 hours of tattooing.", price: "£600", isLimited: false },
        { id: uuidv4(), categoryId: flashCatId, name: "Friday 13th Flash", description: "Selected small designs.", price: "£31", isLimited: true },
        { id: uuidv4(), categoryId: weddingCatId, name: "Half Day Wedding", description: "4 hours of mobile service.", price: "£450", isLimited: false },
    ]).onConflictDoNothing();

    console.log("✅ Seeding complete.");
}

seed();
