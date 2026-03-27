import { db } from "./index";
import { user as userTable } from "./schema";
import { eq } from "drizzle-orm";

async function migrateArtists() {
    console.log("Migrating artists from MDX to DB...");

    const artists = [
        {
            name: "Marco V.",
            email: "marco@funlovintattoo.com", // Placeholder
            role: "owner",
            handle: "marco-v",
            specialty: "Fine Line & Monochrome",
            image: "/assets/fineline_work.png",
            bio: "Marco V. is the creative visionary behind Fun Lovin Tattoo. With over two decades of experience, he specializes in precise, archival-quality linework and complex monochrome compositions. His philosophy centers on the belt of permanence—where every stroke is a dedicated act of artistry.",
            dateStarted: "2004"
        },
        {
            name: "Elena Thorne",
            email: "elena@funlovintattoo.com", // Placeholder
            role: "staff",
            handle: "elena-thorne",
            specialty: "Botanical & Ethereal",
            image: "/assets/archival_tools.png",
            bio: "Elena's work explores the intersection of nature and skin, creating fluid, ethereal designs that flow with the body. She joined the studio in 2018, bringing a soft, organic perspective to our bold gothic aesthetic.",
            dateStarted: "2018"
        }
    ];

    for (const a of artists) {
        // Check if exists
        const existing = await db.select().from(userTable).where(eq(userTable.email, a.email)).limit(1);
        if (existing.length === 0) {
            await db.insert(userTable).values({
                id: crypto.randomUUID(),
                ...a,
                emailVerified: true,
                requiresPasswordReset: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`Created artist: ${a.name}`);
        } else {
            // Update existing with artist fields
            await db.update(userTable)
                .set({
                    role: a.role,
                    handle: a.handle,
                    specialty: a.specialty,
                    image: a.image,
                    bio: a.bio,
                    dateStarted: a.dateStarted,
                    updatedAt: new Date()
                })
                .where(eq(userTable.id, existing[0].id));
            console.log(`Updated artist: ${a.name}`);
        }
    }
}

migrateArtists().catch(console.error);
