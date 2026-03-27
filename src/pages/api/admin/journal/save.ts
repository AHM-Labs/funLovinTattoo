import { canManageGlobalBlog } from "../../../../lib/permissions";
import { db } from "../../../../db";
import { settings } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";
import fs from "node:fs/promises";
import path from "node:path";
import { commitAndPushJournal } from "../../../../lib/git-manager";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    // Require Authentication & Permission
    const session = await auth.api.getSession({ headers: context.request.headers });
    if (!session || !canManageGlobalBlog(session.user.role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Check if blog creation is enabled
    const blogSetting = await db.select().from(settings).where(eq(settings.key, "enableBlogCreation")).limit(1);
    const isEnabled = blogSetting[0]?.value === "true";
    
    if (!isEnabled) {
        return new Response(JSON.stringify({ error: "Blog creation is currently disabled by administrator." }), { status: 403 });
    }

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

        // Save to STAGING folder as requested
        const stagingDir = path.join(process.cwd(), 'src', 'content', 'journal-staging');
        await fs.mkdir(stagingDir, { recursive: true });
        const filePath = path.join(stagingDir, `${slug}.mdx`);
        
        // Write the file to disk
        await fs.writeFile(filePath, content, 'utf8');

        // Automate Git Workflow
        try {
            await commitAndPushJournal(slug);
        } catch (gitErr: any) {
            console.error("File saved but Git push failed:", gitErr);
            // We return success for the file save, but notify about the git failure
            return new Response(JSON.stringify({ 
                success: true, 
                warning: "File saved locally but failed to push to GitHub. Manual sync required." 
            }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
