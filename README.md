# Fun Lovin Tattoo 🖋️

A premium, artisan-focused web platform built with Astro 6, Tailwind CSS v4, and Better Auth. Designed for professional tattoo artists to manage their portfolio, journal, and client inquiries with a high-end, gothic-inspired aesthetic.

## ✨ Key Features

### 🔐 Multi-Artist Portal
- **Passkey-First Security**: Biometric authentication (WebAuthn) for secure, frictionless access.
- **Team Management**: Robust controls for adding artists, revoking access, and managing roles.
- **Secure Onboarding**: Invite-only registration with mandatory password rotation for new users.

### 🎨 Visual Portfolio (Gallery)
- **Masonry Layout**: A high-performance, GSAP-animated public gallery.
- **Visual Asset Manager**: Drag-and-drop uploads with artist-specific attribution and metadata.
- **Integrated Asset Picker**: Seamlessly link gallery items to journal entries within the MDX editor.

### 🖋️ Artisan Journal
- **Field-Persistent MDX Editor**: Robust content creation with frontmatter-aware editing.
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
