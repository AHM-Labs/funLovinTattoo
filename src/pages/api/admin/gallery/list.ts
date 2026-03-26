import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { gallery } from "../../../../db/schema";
import { desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const items = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
        return new Response(JSON.stringify(items), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
