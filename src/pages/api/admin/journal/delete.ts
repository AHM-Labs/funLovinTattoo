import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
export const prerender = false;
import fs from 'node:fs/promises';
import path from 'node:path';

export const DELETE: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const url = new URL(context.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(JSON.stringify({ error: "Missing post ID" }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'src', 'content', 'news', `${id}`);
        
        // Safety check to ensure we only delete files in the news directory
        if (!filePath.startsWith(path.join(process.cwd(), 'src', 'content', 'news'))) {
             return new Response(JSON.stringify({ error: "Invalid path" }), { status: 403 });
        }

        await fs.unlink(filePath);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
