export const prerender = false;
import type { APIRoute } from "astro";
import { db } from "../../db";
import { bookings } from "../../db/schema";

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        
        await db.insert(bookings).values({
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            type: data.type || 'wedding',
            date: data.date || '',
            details: data.details,
            status: 'pending',
            createdAt: new Date()
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
