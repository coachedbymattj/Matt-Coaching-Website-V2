# Coached by Matt J

A multi-page Next.js marketing site for the personal-training practice.

## Run it

```bash
cd ~/personal-training-site
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

- Next.js 14 (App Router, React Server Components by default)
- Tailwind CSS v3 (custom theme: ink palette, ember accent, canvas background)
- Framer Motion (perpetual micro-interactions, layout transitions, springs)
- Geist Sans + Geist Mono (no Inter)
- `@phosphor-icons/react` for iconography (no emoji anywhere)
- Placeholder imagery from `picsum.photos` — swap for real assets later

## Routes

- `/` — Home (asymmetric hero, bento features, transformations, process, testimonials, CTA)
- `/about` — Bio, beliefs, timeline, credentials
- `/services` — Two coaching tiers + FAQ + bespoke engagements
- `/results` — Client transformation archive
- `/journal` — Featured essay + index of long-form posts
- `/apply` — 4-step application form (currently submits to a simulated handler)

## Where to edit

- **Brand copy & numbers:** every page contains realistic placeholders. Search for
  client names (Aoife, Tomás, Priya…) and replace with your real testimonials when ready.
- **Imagery:** every `<img src="https://picsum.photos/seed/…">` is a placeholder.
  Swap for real photography; the seed strings keep them stable while you work.
- **Application form:** [app/components/ApplyForm.tsx](app/components/ApplyForm.tsx) — the `submit()` function currently fakes a 1.2s delay. Wire it to Resend, Formspree, or your own endpoint.
- **Pricing:** [app/services/page.tsx](app/services/page.tsx).
- **Navigation links:** [app/components/Nav.tsx](app/components/Nav.tsx).
- **Theme & spacing tokens:** [tailwind.config.ts](tailwind.config.ts).

## Design rules followed

Per the [taste-skill](https://github.com/Leonxlnx/taste-skill) framework:

- No Inter, no purple/AI-blue gradients, no pure `#000`
- No three-equal-cards layout (zig-zag and 2-card patterns instead)
- Off-black `#0a0a09`, warm canvas `#f4f1ec`, single desaturated ember accent
- `min-h-[100dvh]` on full-height sections (not the broken `h-screen`)
- Cards use `rounded-5xl` (`2.5rem`) with diffusion shadows and inner refraction borders
- Perpetual motion isolated in memoized client components (intelligent list, typewriter, status dots, marquee)
- All form states (empty, in-progress, success) implemented in ApplyForm
- Mobile collapses asymmetric grids to single column under `md:`
