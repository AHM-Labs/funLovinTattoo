import { db } from "../../../../db";
import { pricingCategories, pricingItems, pricingAddons, categoryToAddons } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { canManagePricing } from "../../../../lib/permissions";
import { eq, and } from "drizzle-orm";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || !canManagePricing(session.user.role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const type = context.url.searchParams.get("type") || "studio";

    try {
        const categories = await db.select().from(pricingCategories).where(eq(pricingCategories.type, type)).orderBy(pricingCategories.order);
        const items = await db.select().from(pricingItems).orderBy(pricingItems.order);
        const addons = await db.select().from(pricingAddons);
        const links = await db.select().from(categoryToAddons);

        return new Response(JSON.stringify({ categories, items, addons, links }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || !canManagePricing(session.user.role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { action, ...data } = await context.request.json();

        if (action === "add_category") {
            const id = crypto.randomUUID();
            await db.insert(pricingCategories).values({ id, ...data });
            return new Response(JSON.stringify({ success: true, id }), { status: 200 });
        }

        if (action === "edit_category") {
            await db.update(pricingCategories).set(data).where(eq(pricingCategories.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === "delete_category") {
            await db.delete(pricingCategories).where(eq(pricingCategories.id, data.id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
