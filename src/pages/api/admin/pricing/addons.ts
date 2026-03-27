import { db } from "../../../../db";
import { pricingAddons, categoryToAddons } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { canManagePricing } from "../../../../lib/permissions";
import { eq, and } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || !canManagePricing(session.user.role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { action, ...data } = await context.request.json();

        if (action === "add_addon") {
            const id = crypto.randomUUID();
            await db.insert(pricingAddons).values({ id, ...data });
            return new Response(JSON.stringify({ success: true, id }), { status: 200 });
        }

        if (action === "edit_addon") {
            await db.update(pricingAddons).set(data).where(eq(pricingAddons.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === "delete_addon") {
            await db.delete(pricingAddons).where(eq(pricingAddons.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === "link_addon") {
            await db.insert(categoryToAddons).values({ categoryId: data.categoryId, addonId: data.addonId });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === "unlink_addon") {
            await db.delete(categoryToAddons).where(and(eq(categoryToAddons.categoryId, data.categoryId), eq(categoryToAddons.addonId, data.addonId)));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
