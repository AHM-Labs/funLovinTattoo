import type { APIRoute } from "astro";
export const prerender = false;
import { giftCardDb } from "../../../../db/giftcards/db";
import { giftCards, giftCardTransactions } from "../../../../db/giftcards/schema";
import { auth } from "../../../../lib/auth";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const POST: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const { id, action, amount, description } = await context.request.json();
        if (!id) return new Response(JSON.stringify({ error: "Missing Card ID" }), { status: 400 });

        const [card] = await giftCardDb.select().from(giftCards).where(eq(giftCards.id, id));
        if (!card) return new Response(JSON.stringify({ error: "Gift Card not found" }), { status: 404 });

        const now = new Date();

        if (action === 'redeem') {
            const redeemCents = Math.round(amount * 100);
            if (redeemCents > card.currentBalance) return new Response(JSON.stringify({ error: "Insufficient balance" }), { status: 400 });

            const newBalance = card.currentBalance - redeemCents;
            
            await giftCardDb.update(giftCards).set({ 
                currentBalance: newBalance,
                updatedAt: now 
            }).where(eq(giftCards.id, id));

            await giftCardDb.insert(giftCardTransactions).values({
                id: crypto.randomUUID(),
                giftCardId: id,
                amount: -redeemCents,
                type: 'redemption',
                description: description || 'Manual Redemption',
                createdAt: now
            });
            
            return new Response(JSON.stringify({ success: true, newBalance }), { status: 200 });
        }

        if (action === 'reset-pin') {
            const newPin = Math.floor(1000 + Math.random() * 9000).toString();
            await giftCardDb.update(giftCards).set({ 
                pin: newPin,
                updatedAt: now 
            }).where(eq(giftCards.id, id));
            
            return new Response(JSON.stringify({ success: true, pin: newPin }), { status: 200 });
        }

        if (action === 'void') {
            await giftCardDb.update(giftCards).set({ 
                status: 'disabled',
                updatedAt: now 
            }).where(eq(giftCards.id, id));
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        if (action === 'activate') {
           await giftCardDb.update(giftCards).set({ 
               status: 'active',
               updatedAt: now 
           }).where(eq(giftCards.id, id));
           return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
