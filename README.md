# Fun Lovin Tattoo 🖋️

A premium, artisan-focused web platform built with Astro 6, Tailwind CSS v4, and Better Auth. Designed for professional tattoo artists to manage their portfolio, journal, and client inquiries with a high-end, gothic-inspired aesthetic...

## ✨ Key Features

### 🔐 Artist & Team Management
- **Role-Based Governance**: Granular permissions for **Owners** (Studio Directors), **Admins** (Site Developers), and **Staff** (Resident Artists).
- **Self-Managed Profiles**: Artists control their own bios, creative philosophies, and portfolio galleries.
- **Passkey-First Security**: Biometric authentication (WebAuthn) for secure, frictionless access.
- **Secure Onboarding**: Invite-only registration with mandatory password rotation for new users.

### 🎨 Visual Portfolio (Gallery)
- **Local Asset Hosting**: Direct file-to-server uploads replacing external image URL dependencies.
- **Instant Previews**: Local Blob URL previews for immediate visual verification during uploads.
- **Artist-Specific Attribution**: Automatic linking of work samples to the respective artist profile.
- **Integrated Asset Picker**: Seamlessly link gallery items to journal entries within the MDX editor.

### 🖋️ Artisan Journal & Git-CMS Workflow
The journal module operates as a headless Git-CMS, ensuring all content is version-controlled and peer-reviewed before appearing on the live site.

- **Automated Staging (`upcoming-posts`)**: Every save or edit in the admin dashboard instantly triggers an automated Git workflow. The entry is committed and pushed to a dedicated `upcoming-posts` branch, bypassing the production `main` branch.
- **Conflict-Resistant Publishing**: The system uses automated rebasing and targeted file checkouts to ensure multiple artists can contribute simultaneously without disrupting the runtime environment.
- **Review & Approval Cycle**:
    - **Drafting**: Artists write and format posts using the MDX editor and local asset picker.
    - **Staging**: Upon saving, the post is "pushed" to GitHub in the `journal-staging` directory.
    - **Audit**: Studio Owners or Admins can pull the `upcoming-posts` branch, perform quality checks on the MDX/Frontmatter, and merge into `main`.
- **Fault-Tolerant Saves**: If a network error or Git permission issue occurs, the system preserves the draft locally and alerts the artist to perform a manual sync, ensuring no creative work is ever lost.

### 🚐 Real-Time Studio Ops
- **Van Location Tracker**: Update the studio's real-time mobile location from the dashboard.
- **Inquiry Pipeline**: Streamlined booking management with client-artist communication loops.

## 🛠️ Technology Stack

- **Framework**: [Astro 6](https://astro.build) (Hybrid SSR)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Auth**: [Better Auth v1.5](https://better-auth.com)
- **Database**: [Drizzle ORM](https://orm.drizzle.team) + SQLite
- **Animations**: [GSAP](https://gsap.com)
- **Email**: [Resend](https://resend.com)

## 🚀 Getting Started

1. **Install Dependencies**: `pnpm install`
2. **Setup Environment**: Rename `.env.example` to `.env` and fill in secrets.
3. **Database Setup**: `pnpm db:push`
4. **Run Dev Server**: `pnpm dev -- --host`
5. **Build for Production**: `pnpm build && node ./dist/server/entry.mjs`

---
*Created with focus on artisan craftsmanship and architectural excellence.*
