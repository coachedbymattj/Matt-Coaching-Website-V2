# Coached by Matt J: Brand & Design System

**Tagline (metadata):** "Body transformation, engineered."
**Aesthetic:** athletic editorial, warm off-white canvas, near-black "ink", a rust "ember" accent, condensed display type, subtle grain + speed-stripe texture.

Source of truth: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`.
A live visual version renders at `/style-guide`.

---

## 1. Colour tokens

### Ink (near-black neutral scale)
| Token | Hex | Typical use |
|---|---|---|
| `ink-50` | `#f7f7f6` | subtle bg tints (`bg-ink-50/60`) |
| `ink-100` | `#ececea` | hover backgrounds, neutral tag bg, dividers |
| `ink-200` | `#d6d6d2` | slider tracks, faint dividers |
| `ink-300` | `#b3b3ac` | inactive dots, disabled/muted text |
| `ink-400` | `#86867d` | faint meta text |
| `ink-500` | `#5d5d55` | muted body / label text |
| `ink-600` | `#3f3f3a` | secondary body text |
| `ink-700` | `#2a2a26` | secondary button text |
| `ink-800` | `#1a1a17` | dark hover state |
| `ink-900` | `#101010` | primary text, dark cards, body default |
| `ink-950` | `#0a0a09` | darkest surfaces (footer, dark sections, `.bg-ink`) |

### Ember (rust accent)
| Token | Hex | Typical use |
|---|---|---|
| `ember` (DEFAULT) | `#c8553d` | core accent: selection, focus ring, live dots, accents |
| `ember-soft` | `#d97a64` | accent on dark surfaces (eyebrows, soft highlights) |
| `ember-deep` | `#8e3a29` | accent text on light (eyebrows, tag text), gradient end |
| `ember-bright` | `#e8623f` | gradient bright stop, `ember-pulse` dot |

### Canvas
| Token | Hex | Typical use |
|---|---|---|
| `canvas` | `#f4f1ec` | page background, light text on dark surfaces |

### Base defaults (globals)
- Body background `#f4f1ec` (canvas) · Body text `#101010` (ink-900)
- `::selection` -> background `#c8553d`, text `#f4f1ec`
- `color-scheme: light`

### Raw hexes used inside CSS (part of the system, not Tailwind tokens)
- Primary button gradient (`.btn-ember`): `#bd4b34 -> #a8412c -> #8e3a29` (deeper than the decorative gradient so white text clears WCAG AA 4.5:1)
- Decorative ember gradient (`bg-ember-grad` / `.text-ember-grad`): `#e8623f -> #c8553d -> #8e3a29`
- Shadow tints: `rgba(142,58,41,..)` (ember-deep) and `rgba(200,85,61,..)` (= ember `#c8553d`)

---

## 2. Typography

| Family | CSS variable | Tailwind class | Weights | Where it is used |
|---|---|---|---|---|
| Barlow Condensed | `--font-barlow-condensed` | `font-display` | 500, 600, 700 | All headings, big stat numerals, nav wordmark, card titles, usually uppercase, bold, tight tracking |
| Barlow | `--font-barlow` | `font-sans` (default) | 300, 400, 500, 600, 700 | Body copy, paragraphs, descriptions, input text, button labels |
| Geist Mono | `--font-geist-mono` | `font-mono` | package default | Eyebrows/labels (uppercase, tracked), data & numbers (stats, prices, weights, tables), badges, meta |

- `.font-display` extras: `font-feature-settings: "ss01"`, `letter-spacing: -0.01em`
- Custom tracking token: `tracking-tightest` = `-0.04em`
- Heading recipe: `font-display font-bold uppercase leading-[0.9] tracking-[-0.01em]`
- Label recipe: `font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500` (accent variant `text-ember-deep`)

---

## 3. Buttons

**Primary (`.btn-ember`)** (all main CTAs)
```css
background-image: linear-gradient(100deg, #bd4b34 0%, #a8412c 55%, #8e3a29 100%);
color: #ffffff;
box-shadow: 0 10px 30px -12px rgba(142,58,41,0.55);
transition: box-shadow .2s, filter .2s, transform .05s;
/* hover  */ filter: brightness(1.08); box-shadow: 0 16px 38px -12px rgba(200,85,61,0.55);
/* active */ transform: translateY(1px); box-shadow: 0 6px 18px -10px rgba(142,58,41,0.6);
```
Layout: `rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]`

- **Secondary (light):** `rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 hover:bg-ink-100`
- **Secondary (on dark):** `border border-canvas/15 text-canvas hover:bg-canvas hover:text-ink-900`
- **Segmented toggle:** active `bg-ink-900 text-canvas`; inactive `border hairline text-ink-600 hover:bg-ink-100`
- **Tags / pills:** neutral `bg-ink-100 text-ink-600`; accent `bg-ember/10 text-ember-deep`, both `font-mono text-[10px] uppercase tracking-[0.14em]`

---

## 4. Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-2xl` / `3xl` | 1rem / 1.5rem (Tailwind) | inputs, small cards, chips |
| `rounded-4xl` | `2rem` | standard cards |
| `rounded-5xl` | `2.5rem` | large feature panels, hero/result cards |
| `rounded-full` | 9999px | buttons, chips, dots, badges |

---

## 5. Shadow tokens

| Token | Value |
|---|---|
| `shadow-diffusion` | `0 30px 60px -25px rgba(16,16,16,0.18)` |
| `shadow-diffusion-sm` | `0 18px 40px -20px rgba(16,16,16,0.12)` |
| `shadow-inner-glass` | `inset 0 1px 0 rgba(255,255,255,0.08)` |
| `shadow-ember-glow` | `0 0 0 1px rgba(200,85,61,0.25), 0 18px 50px -18px rgba(200,85,61,0.45)` |

---

## 6. Gradients

| Name | Definition | Use |
|---|---|---|
| `bg-ember-grad` | `linear-gradient(100deg, #e8623f 0%, #c8553d 45%, #8e3a29 100%)` | accent fills (nav active bar, badges, metric pills) |
| `.text-ember-grad` | `linear-gradient(100deg, #e8623f 0%, #c8553d 55%, #8e3a29 100%)` clipped to text | accent words in headlines |
| `.btn-ember` gradient | `linear-gradient(100deg, #bd4b34 0%, #a8412c 55%, #8e3a29 100%)` | primary buttons (AA-safe with white text) |

---

## 7. Texture, borders & effect utilities

| Utility | What it does |
|---|---|
| `.grain` | Fixed full-screen SVG fractal-noise overlay; `opacity 0.05`, `mix-blend-mode overlay`, `z-index 60`, `pointer-events none`. On `<body>` and dark sections. |
| `.speed-stripes` | Diagonal repeating stripes at `-56deg`, `rgba(244,241,236,0.06)` (2px on / 10px off). Athletic texture on dark panels. |
| `.hairline` | Border colour `rgba(16,16,16,0.08)` (hairline on light). |
| `.hairline-dark` | Border colour `rgba(244,241,236,0.1)` (hairline on dark). |
| `.ember-mark` | Kinetic ember underline under a heading word (skewed -12deg, gradient `#e8623f -> #c8553d`). |
| `.shimmer-text` | Sweeping light gradient clipped to text (uses `shimmer` animation). |
| `.text-stroke` | Outlined ghost numerals: `-webkit-text-stroke: 1.5px rgba(16,16,16,0.22)`, transparent fill. |
| `.text-stroke-canvas` | Same, light: `1.5px rgba(244,241,236,0.28)` for dark backgrounds. |
| `.bg-ink` | Solid `#0a0a09`. |

---

## 8. Animations

| Class | Timing | Keyframes |
|---|---|---|
| `animate-marquee` | `38s linear infinite` | `translateX(0 -> -50%)` |
| `animate-marquee-reverse` | `46s linear infinite` | `translateX(-50% -> 0)` |
| `animate-breathe` | `2.4s ease-in-out infinite` | opacity `0.55 <-> 1` |
| `animate-shimmer` | `2.6s linear infinite` | `background-position -200% -> 200%` |
| `animate-ember-pulse` | `2.6s ease-in-out infinite` | expanding ring `0 0 0 0 rgba(200,85,61,0.45) -> 0 0 0 6px rgba(200,85,61,0)` |

---

## 9. Accessibility conventions

- **Focus ring (global):** `a, button, input, textarea, select, [tabindex]` get `outline: 2px solid #c8553d; outline-offset: 2px` on `:focus-visible`.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` near-zeroes animation/transition durations and disables smooth scroll. (Exception: the Results carousel still auto-advances, as a fade.)
- **Contrast:** primary button gradient is deepened so white text clears WCAG AA 4.5:1; ink-900 on canvas is the default high-contrast pairing.
- **No pure black** (`#000`); `ink-950 #0a0a09` is the floor.
