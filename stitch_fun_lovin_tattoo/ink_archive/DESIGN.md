# Design System: The Modern Archivist

## 1. Overview & Creative North Star

### Creative North Star: "The Curated Relic"
This design system rejects the clinical perfection of modern SaaS interfaces in favor of something more tactile, storied, and visceral. We are building a "Digital Archive" for a tattoo studio—a space where high-end fashion editorial meets the grit of a traditional street shop. 

The goal is to break the "template" look. We achieve this through **Intentional Asymmetry**, where elements bleed off the edge of the viewport; **Overlapping Hierarchy**, where typography and imagery intersect to create depth; and **Tonal Mood**, utilizing a high-contrast palette that favors deep blacks and weathered ivories. This system should feel like a rare, hand-bound magazine found in a private library—professional, yet unmistakably edgy.

---

## 2. Colors

The palette is rooted in a moody, high-contrast foundation. It uses ink-inspired blacks and parchment-like neutrals to create a sense of permanence.

### The Palette (Material Design Tokens)
- **Primary (`#ffffff`):** Stark White. Used for high-impact display type and primary CTAs.
- **Surface/Background (`#131313`):** Deep Black. The primary canvas for the "Moody" aesthetic.
- **Secondary (`#c9c6c0`):** Ivory/Parchment. Used for lower-priority surfaces and secondary text.
- **Tertiary (`#e5e2e1`):** A soft, weathered neutral for subtle accents.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. Structure must be defined by:
1.  **Background Shifts:** Transitioning from `surface` (`#131313`) to `surface-container-low` (`#1b1b1b`).
2.  **Organic Bleeds:** Using ink-bleed shapes or paper-texture overlays to mask the transition between sections.
3.  **Negative Space:** Utilizing the Spacing Scale (e.g., `20` or `24`) to create breathing room that defines boundaries.

### Glass & Gradient Rule
To provide "soul," use subtle radial gradients on hero backgrounds, transitioning from `surface` to `surface-container-high`. For floating elements (like artist navigation), apply Glassmorphism: use `surface-variant` at 60% opacity with a `20px` backdrop-blur.

---

## 3. Typography

The typography strategy is purely editorial. We pair a sophisticated, high-contrast serif with a brutalist sans and a technical mono-space for labels.

-   **Display (Newsreader):** The "voice" of the brand. Use `display-lg` (3.5rem) for hero statements. Encourage overlapping layouts where display text sits partially behind or on top of image assets.
-   **Headline (Newsreader):** Used for section titles. These should feel like magazine headers—tight tracking and bold presence.
-   **Body (Work Sans):** The utilitarian balance. Highly legible, used for artist bios and procedure descriptions.
-   **Label (Space Grotesk):** The "Archivist" touch. Used for metadata, dates, and technical details.

---

## 4. Elevation & Depth

We eschew traditional "drop shadows" for a more organic, tonal layering approach.

-   **The Layering Principle:** Stack containers to create hierarchy. A card should be `surface-container-lowest` on top of a `surface` background. This creates a natural "recessed" or "lifted" feel without artificial outlines.
-   **Ambient Shadows:** If a floating effect is required (e.g., an appointment modal), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5)`. The shadow should feel like a soft glow of ink, not a hard geometric shape.
-   **The Ghost Border:** For accessibility in form fields, use the `outline-variant` token (`#474747`) at 20% opacity. This creates a suggestion of a border that feels "distressed" rather than "engineered."
-   **Custom Borders:** Use SVG-masked "hand-drawn" borders for primary image containers to reinforce the "Archivist" aesthetic.

---

## 5. Components

### Buttons
-   **Primary:** Stark White (`primary`) background, Deep Black (`on-primary`) text. Radius: `0px` (Strictly square). 
-   **Secondary:** Ghost style. `outline-variant` at 20% opacity with `primary` text.
-   **Interaction:** On hover, the button should "bleed"—a subtle expansion of a secondary color gradient from the center.

### Inputs
-   **Text Fields:** No background. A single bottom border using `outline-variant` at 40% opacity. Labels use `label-md` (Space Grotesk) in `secondary`.
-   **Error State:** Use `error` (`#ffb4ab`) for the underline and helper text.

### Cards & Lists
-   **The Gallery Card:** Forbid divider lines. Separate list items using `spacing-8`. 
-   **Ink-Bleed Shapes:** Use organic, non-geometric masks for image thumbnails. No two thumbnails in a list should have the exact same mask.

### Additional Signature Components
-   **The Progress Scroll:** A vertical, distressed ink-line on the left margin that "fills" as the user scrolls through an artist's portfolio.
-   **The Texture Overlay:** A global fixed `div` with a low-opacity paper grain texture (`#ffffff`, 3% opacity) to give the entire UI a tactile, non-digital finish.

---

## 6. Do's and Don'ts

### Do
*   **Do** overlap elements. Let a serif headline bleed over the edge of a tattoo photograph.
*   **Do** use extreme vertical spacing. Give the content room to feel like a premium exhibition.
*   **Do** use `0px` border-radius for everything. Sharp corners equate to professional precision in this system.
*   **Do** embrace the "Modern Archivist" vibe by using technical labels (e.g., "COLLECTION NO. 042") for gallery sections.

### Don't
*   **Don't** use rounded corners. It breaks the professional/grungy tension.
*   **Don't** use standard "system" blues or greens for success/info states. Stick to the monochromatic palette unless it is a critical error.
*   **Don't** use 100% opaque lines. If you need a separator, use a tonal shift or a distressed, low-opacity SVG path.
*   **Don't** center everything. Use asymmetrical grids (e.g., 2-column layouts where one column is 70% width and the other is 30%) to maintain the editorial feel.