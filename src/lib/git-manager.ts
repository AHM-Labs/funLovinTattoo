import { execSync } from "node:child_process";
import path from "node:path";

const run = (cmd: string) => {
    try {
        return execSync(cmd, { cwd: process.cwd(), encoding: "utf8" });
    } catch (e: any) {
        console.error(`Git Command Failed: ${cmd}`, e.stderr || e.message);
        throw e;
    }
};

/**
 * Automates the process of committing a journal entry to a separate branch.
 * @param slug The slug of the post (to identify the file)
 */
export async function commitAndPushJournal(slug: string) {
    const filePath = path.join('src', 'content', 'journal-staging', `${slug}.mdx`);
    const branchName = "upcoming-posts";
    const currentBranch = run("git rev-parse --abbrev-ref HEAD").trim();

    try {
        // 1. Ensure the branch exists
        try {
            run(`git branch ${branchName}`);
        } catch (e) {
            // Branch likely already exists
        }

        // 2. Switch to the target branch
        run(`git checkout ${branchName}`);

        // 3. Pull latest from remote to avoid conflicts
        try {
            run(`git pull origin ${branchName} --rebase`);
        } catch (e) {
            // Might fail if remote branch doesn't exist yet, ignore
        }

        // 4. Bring the specific file change over from the working branch (where it was just written)
        // Since the file was written to disk on the currentBranch, it's technically "dirty" 
        // until we add it. 
        run(`git checkout ${currentBranch} -- ${filePath}`);

        // 5. Add, Commit, and Push
        run(`git add ${filePath}`);
        
        // Use a generic author if needed, or rely on system config
        run(`git commit -m "Journal Update: ${slug} (${new Date().toISOString()})"`);
        
        run(`git push origin ${branchName}`);

        console.log(`Successfully pushed ${slug} to ${branchName}`);
    } catch (err: any) {
        console.error("Failed to automate git workflow:", err.message);
        throw new Error(`Git Workflow Failed: ${err.message}`);
    } finally {
        // ALWAYS return to the original branch
        run(`git checkout ${currentBranch}`);
    }
}
