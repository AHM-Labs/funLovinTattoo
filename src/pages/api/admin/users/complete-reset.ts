export const prerender = false;
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    try {
        await db.update(user)
                .set({ requiresPasswordReset: false })
                .where(eq(user.id, session.user.id));
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
