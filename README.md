# Fun Lovin Tattoo 🖋️

A premium, artisan-focused web platform built with Astro 6, Tailwind CSS v4, and Better Auth. Designed for professional tattoo artists to manage their portfolio, journal, and client inquiries with a high-end, gothic-inspired aesthetic.

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

### 🖋️ Artisan Journal
- **Field-Persistent MDX Editor**: Robust content creation with frontmatter-aware editing.
- **Rich Text Support**: Artists can now document their process and philosophy with expressive formatting.
- **Archival Workflows**: Artists can document their process, shop life, and guest spots with ease.

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

1. **Install Dependencies**: `npm install`
2. **Setup Environment**: Rename `.env.example` to `.env` and fill in secrets.
3. **Database Setup**: `npx drizzle-kit push`
4. **Run Dev Server**: `npm run dev -- --host`
5. **Build for Production**: `npm run build && node ./dist/server/entry.mjs`

---
*Created with focus on artisan craftsmanship and architectural excellence.*
