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
        const { amount } = await context.request.json();
        if (!amount || amount <= 0) return new Response(JSON.stringify({ error: "Invalid amount" }), { status: 400 });

        const amountInCents = Math.round(amount * 100);

        // Generate ID: FLT-XXXX-XXXX
        let id = "";
        let isUnique = false;
        while (!isUnique) {
            const p1 = crypto.randomBytes(2).toString('hex').toUpperCase();
            const p2 = crypto.randomBytes(2).toString('hex').toUpperCase();
            id = `FLT-${p1}-${p2}`;
            
            const existing = await giftCardDb.select().from(giftCards).where(eq(giftCards.id, id)).limit(1);
            if (existing.length === 0) isUnique = true;
        }

        // Generate PIN: 4 digits
        const pin = Math.floor(1000 + Math.random() * 9000).toString();

        const now = new Date();

        // Save gift card
        await giftCardDb.insert(giftCards).values({
            id,
            pin,
            initialAmount: amountInCents,
            currentBalance: amountInCents,
            status: 'active',
            createdAt: now,
            updatedAt: now
        });

        // Log transaction
        await giftCardDb.insert(giftCardTransactions).values({
            id: crypto.randomUUID(),
            giftCardId: id,
            amount: amountInCents,
            type: 'issue',
            description: 'Initial Activation',
            createdAt: now
        });

        return new Response(JSON.stringify({ success: true, id, pin }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
