import type { APIRoute } from "astro";
export const prerender = false;
import { db } from "../../../../db";
import { bookings } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";

const GATEWAY_URL = process.env.SERVER_GATEWAY_URL || 'http://localhost:3000/api/v2/action';
const CLIENT_ID = process.env.SERVER_GATEWAY_CLIENT_ID || 'fun-lovin-tattoo';

export const POST: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const { id, action, message } = await context.request.json();

        if (!id || !['accept', 'decline'].includes(action)) {
            return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        }

        const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
        if (!booking) return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });

        // Update database status
        const newStatus = action === 'accept' ? 'accepted' : 'declined';
        await db.update(bookings).set({ status: newStatus }).where(eq(bookings.id, id));

        // Prepare Email
        const subject = action === 'accept' 
            ? "Booking Accepted! - Fun Lovin Tattoo" 
            : "Update on your Enquiry - Fun Lovin Tattoo";
        
        const artistMessage = message ? `<div style="background: #f9f9f9; border-left: 4px solid #000; padding: 15px; margin: 20px 0; font-style: italic;">"${message}"</div>` : '';
        
        const instagramUrl = "https://instagram.com/funlovintattoos"; // Replace with actual handle
        const mailtoUrl = `mailto:hello@funlovintattoo.com?subject=Re: Booking Enquiry - ${booking.name}`;

        const html = action === 'accept' 
            ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee;">
                <h1 style="color: #000; text-transform: uppercase; font-style: italic;">Accepted.</h1>
                <p>Hi ${booking.name},</p>
                <p>Great news! We have reviewed your vision for a <strong>${booking.type}</strong> and we'd love to bring it to life.</p>
                ${artistMessage}
                <p>To finalize the appointment and discuss scheduling, please continue the conversation via your preferred channel:</p>
                <div style="margin: 30px 0; display: flex; gap: 15px;">
                    <a href="${instagramUrl}" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 2px;">Continue on Instagram</a>
                    <a href="${mailtoUrl}" style="background: #eee; color: #000; padding: 12px 25px; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; border: 1px solid #000;">Reply via Email</a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Fun Lovin Tattoo - Artisan Craftsmanship</p>
               </div>`
            : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee;">
                <h1 style="color: #666; text-transform: uppercase; font-style: italic;">Update.</h1>
                <p>Hi ${booking.name},</p>
                <p>Thank you for reaching out regarding a ${booking.type} session.</p>
                <p>After careful consideration, we are unable to accept this specific request at this time.</p>
                ${artistMessage}
                <p>We appreciate your interest in the studio and wish you the best with your project.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Fun Lovin Tattoo - Professional Artistry</p>
               </div>`;

        // Send Email via Server Gateway
        try {
            await fetch(GATEWAY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: CLIENT_ID,
                    cfToken: 'localhost-admin-bypass', // Bypass turnstile for internal admin actions if configured
                    to: booking.email,
                    subject: subject,
                    html: html
                })
            });
        } catch (error) {
            console.error('Failed to send email via gateway:', error);
            // We don't block the response for email failures in this context
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
