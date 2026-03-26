import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { gallery } from "../../../../db/schema";
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const formData = await context.request.formData();
        const file = formData.get("image") as File;
        const altText = formData.get("altText") as string;
        const description = formData.get("description") as string;

        if (!file || !altText) {
            return new Response(JSON.stringify({ error: "Missing image or alt text" }), { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return new Response(JSON.stringify({ error: "Invalid file type. Only images are allowed." }), { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${crypto.randomUUID()}${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "assets", "gallery");
        
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        const url = `/assets/gallery/${filename}`;

        await db.insert(gallery).values({
            id: crypto.randomUUID(),
            url,
            altText,
            description,
            artistId: session.user.id,
            createdAt: new Date()
        });

        return new Response(JSON.stringify({ success: true, url }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
