export const prerender = false;
import { auth } from "../../../lib/auth";
import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export const POST: APIRoute = async (context) => {
    // Auth Check
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    try {
        const formData = await context.request.formData();
        const file = formData.get("file") as File;
        const category = (formData.get("category") as string) || "misc";

        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
        }

        // Validate type
        if (!file.type.startsWith("image/")) {
            return new Response(JSON.stringify({ error: "Only images are allowed" }), { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${uuidv4()}${ext}`;
        
        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", category);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/${category}/${filename}`;
        
        return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
    } catch (e: any) {
        console.error("Upload error:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
