export const prerender = false;
import type { APIRoute } from "astro";
import { db } from "../../db";
import { bookings } from "../../db/schema";
import fs from "node:fs/promises";
import path from "node:path";

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string || '';
        const type = formData.get("type") as string || 'tattoo';
        const date = formData.get("date") as string || '';
        const details = formData.get("details") as string;
        
        const files = formData.getAll("images") as File[];
        const imageUrls: string[] = [];

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public", "assets", "uploads", "inquiries");
        await fs.mkdir(uploadDir, { recursive: true });

        // Process up to 5 images
        for (const file of files.slice(0, 5)) {
            if (file.size > 0 && file.type.startsWith("image/")) {
                const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
                const filePath = path.join(uploadDir, fileName);
                const buffer = Buffer.from(await file.arrayBuffer());
                await fs.writeFile(filePath, buffer);
                imageUrls.push(`/assets/uploads/inquiries/${fileName}`);
            }
        }

        await db.insert(bookings).values({
            id: crypto.randomUUID(),
            name,
            email,
            phone,
            type,
            date,
            details,
            status: 'pending',
            images: JSON.stringify(imageUrls),
            createdAt: new Date()
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error("Inquiry Upload Error:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
