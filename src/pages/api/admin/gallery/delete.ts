import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { gallery } from "../../../../db/schema";
import fs from 'node:fs/promises';
import path from 'node:path';
import { eq } from "drizzle-orm";

export const prerender = false;

export const DELETE: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

    try {
        const item = await db.select().from(gallery).where(eq(gallery.id, id)).get();
        if (!item) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

        // Security: Ensure owner or admin deletes
        // Note: Better Auth provides role in session.user.role if synced
        if (item.artistId !== session.user.id && session.user.role !== 'admin') {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        // Delete file
        const filename = path.basename(item.url);
        const filePath = path.join(process.cwd(), "public", "assets", "gallery", filename);
        
        try {
            await fs.unlink(filePath);
        } catch (e) {
            console.warn("File already gone or unreadable:", filePath);
        }

        // Delete from DB
        await db.delete(gallery).where(eq(gallery.id, id));

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
