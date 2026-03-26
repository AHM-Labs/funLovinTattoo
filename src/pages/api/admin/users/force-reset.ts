export const prerender = false;
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user as userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || session.user.role !== 'admin') return new Response("Unauthorized", { status: 401 });

    const { id } = await context.request.json();

    try {
        await db.update(userTable)
                .set({ requiresPasswordReset: true })
                .where(eq(userTable.id, id));
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
