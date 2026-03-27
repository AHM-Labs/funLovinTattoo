export const prerender = false;
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { gallery as galleryTable } from "../../../../db/schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    // Auth Check
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { url, altText } = await context.request.json();

    if (!url || !altText) return new Response("Missing data", { status: 400 });

    try {
        await db.insert(galleryTable).values({
            id: crypto.randomUUID(),
            url,
            altText,
            artistId: session.user.id,
            createdAt: new Date()
        });
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
