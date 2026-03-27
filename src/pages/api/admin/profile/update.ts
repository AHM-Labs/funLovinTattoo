export const prerender = false;
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user as userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    // Auth Check
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await context.request.json();

    try {
        await db.update(userTable)
                .set({
                    name: data.name,
                    handle: data.handle,
                    image: data.image,
                    specialty: data.specialty,
                    dateStarted: data.dateStarted,
                    bio: data.bio,
                    updatedAt: new Date()
                })
                .where(eq(userTable.id, session.user.id));
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
