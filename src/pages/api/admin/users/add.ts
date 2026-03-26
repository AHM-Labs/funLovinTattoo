export const prerender = false;
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { user as userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    // Auth Check
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || session.user.role !== 'admin') return new Response("Unauthorized", { status: 401 });

    const { name, email } = await context.request.json();

    try {
        // Use better-auth signUp to handle hashing
        // This technically logs the session out if we use client signUp, 
        // but we are calling the server-side signUpEmail directly.
        // Wait, auth.api.signUpEmail usually expects a request object or handles it via internal context.
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password: "password",
                name
            }
        });

        // Elevated to admin/force reset
        await db.update(userTable)
                .set({ role: "admin", requiresPasswordReset: true })
                .where(eq(userTable.id, result.user.id));
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
