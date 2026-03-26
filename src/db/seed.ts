import { auth } from "../lib/auth";
import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
    console.log("🌱 Seeding initial admin user...");
    
    const email = "aaron@ahm-labs.com";
    const password = "password";

    try {
        // 1. Create the user via Better Auth (handles hashing)
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: "Aaron Admin"
            }
        });
        
        const userId = result.user.id;

        // 2. Update the user with admin role and reset flag directly in DB
        // (Ensures custom fields are set regardless of Better Auth signUp constraints)
        await db.update(user)
                .set({ 
                    role: "admin", 
                    requiresPasswordReset: true 
                })
                .where(eq(user.id, userId));

        console.log("✅ Admin user created and elevated successfully.");
    } catch (e: any) {
        if (e.message?.includes("already exists")) {
            console.log("ℹ️ Admin user already exists. Elevating just in case...");
            const existing = await db.select().from(user).where(eq(user.email, email));
            if (existing.length > 0) {
                 await db.update(user)
                    .set({ role: "admin", requiresPasswordReset: true })
                    .where(eq(user.id, existing[0].id));
                 console.log("✅ Existing user elevated.");
            }
        } else {
            console.error("❌ Seeding failed:", e);
        }
    }
}

seed();
