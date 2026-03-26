import type { APIRoute } from "astro";
export const prerender = false;
import { db } from "../../../../db";
import { bookings } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const { id, action } = await context.request.json();

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
            ? "Your Tattoo Booking Request has been Accepted! - Fun Lovin Tattoo" 
            : "Update regarding your Tattoo Inquiry - Fun Lovin Tattoo";
        
        const html = action === 'accept' 
            ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h1 style="color: #000; text-transform: uppercase;">Accepted.</h1>
                <p>Hi ${booking.name},</p>
                <p>Great news! We have accepted your booking request for a <strong>${booking.type}</strong> session.</p>
                <p>We'll be in touch shortly to finalize the details and timing.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">Fun Lovin Tattoo - Professional Artistry</p>
               </div>`
            : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h1 style="color: #000; text-transform: uppercase;">Update.</h1>
                <p>Hi ${booking.name},</p>
                <p>Thank you for your inquiry for a ${booking.type} session.</p>
                <p>Unfortunately, we are unable to fulfill your request at this time. We appreciate your interest and hope to see you in the future.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">Fun Lovin Tattoo - Professional Artistry</p>
               </div>`;

        // Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Fun Lovin Tattoo <onboarding@resend.dev>', // Change to verified domain in prod
                to: booking.email,
                subject: subject,
                html: html,
            });
        } else {
            console.log("RESEND_API_KEY not found. Email not sent, but DB updated.");
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
