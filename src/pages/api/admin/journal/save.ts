import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
export const prerender = false;
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async (context) => {
    // Require Authentication
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    try {
        const { slug, content } = await context.request.json();

        if (!slug || !content) {
            return new Response(JSON.stringify({ error: "Missing slug or content" }), { status: 400 });
        }

        const trimmedContent = content.trim();
        // Basic Frontmatter Check
        if (!trimmedContent.startsWith('---') || trimmedContent.split('---').length < 3) {
            return new Response(JSON.stringify({ error: "Invalid MDX: Missing frontmatter block." }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'src', 'content', 'news', `${slug}.mdx`);
        
        // Write the file to disk
        await fs.writeFile(filePath, content, 'utf8');

        // Trigger Build as requested
        // Note: In a real production environment, this should be handled by a queue 
        // or a background worker to avoid blocking the response.
        const { exec } = await import('node:child_process');
        exec('npm run build', (error, stdout, stderr) => {
            if (error) {
                console.error(`Build error: ${error}`);
                return;
            }
            console.log(`Build success: ${stdout}`);
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
