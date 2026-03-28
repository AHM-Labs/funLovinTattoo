import type { APIRoute } from "astro";
export const prerender = false;
import { giftCardDb } from "../../../db/giftcards/db";
import { giftCards } from "../../../db/giftcards/schema";
import { eq, and } from "drizzle-orm";

export const POST: APIRoute = async (context) => {
    try {
        const { id, pin } = await context.request.json();
        if (!id || !pin) return new Response(JSON.stringify({ error: "Missing Card ID or PIN" }), { status: 400 });

        const [card] = await giftCardDb.select().from(giftCards).where(
            and(
                eq(giftCards.id, id),
                eq(giftCards.pin, pin)
            )
        );

        if (!card) {
            return new Response(JSON.stringify({ error: "Invalid Card ID or PIN" }), { status: 404 });
        }

        if (card.status !== 'active') {
            return new Response(JSON.stringify({ error: "This gift card is inactive" }), { status: 403 });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            balance: card.currentBalance / 100,
            id: card.id
        }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Balance check failed" }), { status: 500 });
    }
};
