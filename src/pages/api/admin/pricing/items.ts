import { db } from "../../../../db";
import { pricingItems } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { canManagePricing } from "../../../../lib/permissions";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || !canManagePricing(session.user.role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { action, ...data } = await context.request.json();

        if (action === "add_item") {
            const id = crypto.randomUUID();
            await db.insert(pricingItems).values({ id, ...data });
            return new Response(JSON.stringify({ success: true, id }), { status: 200 });
        }

        if (action === "edit_item") {
            await db.update(pricingItems).set(data).where(eq(pricingItems.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === "delete_item") {
            await db.delete(pricingItems).where(eq(pricingItems.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
