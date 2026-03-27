import { db } from "./index";
import { user as userTable } from "./schema";
import { ne } from "drizzle-orm";

async function clearArtists() {
    console.log("Clearing migrated artists...");
    // Keep 'admin' but remove others
    await db.delete(userTable).where(ne(userTable.role, 'admin'));
    console.log("Cleanup complete.");
}

clearArtists().catch(console.error);
