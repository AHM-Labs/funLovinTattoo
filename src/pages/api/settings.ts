export const prerender = false;
import type { APIRoute } from "astro";
import { db } from "../../db";
import { settings } from "../../db/schema";
import { auth } from "../../lib/auth";

export const POST: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await context.request.json();
    const { key, value } = data;

    if (!key || value === undefined) return new Response("Missing data", { status: 400 });

    try {
        await db.insert(settings).values({
            id: crypto.randomUUID(),
            key,
            value,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: settings.key,
            set: { value, updatedAt: new Date() }
        });
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
