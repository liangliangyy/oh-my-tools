# oh-my-tools — Design System

## Direction

**Who:** Developer mid-task. They're in their editor, need one quick thing — decode a JWT, format some JSON, check a regex. They want to get in, do the thing, get out. Not browsing. Context-switching.

**What they do:** Paste input, get output. One transform. That's it.

**Feel:** Precision. Like a well-made terminal — functional beauty, everything purposeful. Dense enough to feel powerful, quiet enough to not distract. Not warm. Not cold. Precise.

**Signature:** The transform pipe. Developer tools ARE `input | transform | output`. Every tool does exactly one thing. That arrow, that moment, is the product's identity. Data values are always monospace — they are the product.

---

## Palette

Built on OKLch. Hue stays consistent within a surface family — only lightness shifts. Accent is teal-cyan pulled from terminal aesthetics (hue 160). Category accents are distinct but muted — never compete with content.

### Dark Mode (default experience)

```css
/* Canvas */
--bg-base: oklch(0.12 0 0);       /* Terminal black — the canvas */
--bg-raised: oklch(0.16 0 0);     /* Cards, panels */
--bg-overlay: oklch(0.20 0 0);    /* Dropdowns, popovers */
--bg-inset: oklch(0.09 0 0);      /* Input fields — sunken */

/* Text hierarchy — 4 levels */
--text-primary: oklch(0.95 0 0);      /* Primary content */
--text-secondary: oklch(0.75 0 0);    /* Labels, metadata */
--text-tertiary: oklch(0.55 0 0);     /* Hints, disabled */
--text-muted: oklch(0.40 0 0);        /* Placeholder, decorative */

/* Borders — 2 levels */
--border-default: oklch(0.26 0 0);    /* Standard separation */
--border-subtle: oklch(0.20 0 0);     /* Inner grouping */

/* Accent: terminal teal — hue 160 */
--accent: oklch(0.70 0.15 160);
--accent-dim: oklch(0.55 0.12 160);   /* Hover state */
--accent-bg: oklch(0.20 0.04 160);    /* Subtle accent surface */
--accent-border: oklch(0.35 0.08 160);/* Accent boundary */

/* Semantic */
--signal-ok: oklch(0.72 0.18 145);    /* Success */
--signal-warn: oklch(0.80 0.20 75);   /* Warning */
--signal-err: oklch(0.60 0.22 25);    /* Error/destructive */
--signal-info: oklch(0.70 0.15 220);  /* Informational */
```

### Light Mode

```css
--bg-base: oklch(0.98 0 0);
--bg-raised: oklch(1 0 0);
--bg-overlay: oklch(1 0 0);
--bg-inset: oklch(0.94 0 0);

--text-primary: oklch(0.15 0 0);
--text-secondary: oklch(0.40 0 0);
--text-tertiary: oklch(0.58 0 0);
--text-muted: oklch(0.70 0 0);

--border-default: oklch(0.88 0 0);
--border-subtle: oklch(0.93 0 0);

--accent: oklch(0.50 0.15 160);
--accent-dim: oklch(0.42 0.12 160);
--accent-bg: oklch(0.94 0.03 160);
--accent-border: oklch(0.80 0.08 160);

--signal-ok: oklch(0.45 0.18 145);
--signal-warn: oklch(0.55 0.20 75);
--signal-err: oklch(0.45 0.22 25);
--signal-info: oklch(0.50 0.15 220);
```

### Category Accent Colors

Each tool category gets a distinct muted accent for visual identity in the tool grid. Used ONLY for the category label and card indicator — never for content.

```
Format (JSON, Markdown, YAML, Diff):  hue 185  — slate-cyan, "clean water, precision"
Encode (Base64, URL, Hash, JWT):      hue 70   — amber, "encoded signal, warm"
Crypto (AES, RSA, HMAC, Keys):        hue 30   — orange, "fire, locked, security"
Generate (UUID, Password, QR):        hue 145  — green, "generation, creation"
Convert (Time, Color, Units, Dates):  hue 280  — purple, "transformation, alchemy"
Network (CIDR, Chmod, Ports):         hue 220  — blue, "network, flow, data"
```

---

## Depth Strategy

**Rule: Borders-only. No shadows. Anywhere.**

Dark mode: surface elevation via lightness steps only. Cards are 4 points lighter than canvas. Overlays 4 more. Inputs are sunken — darker than canvas.

Light mode: same rule. Surfaces use background tints, borders define edges. No drop shadows on cards.

The only exception: focus rings use a 0px 0px 0px 2px ring with the accent color — this is interactive feedback, not decoration.

```
Canvas:  bg-base
Card:    bg-raised + border-default
Panel:   bg-raised + border-default (same as card)
Overlay: bg-overlay + border-default + z-index
Input:   bg-inset + border-default (focused: accent-border + ring)
```

---

## Spacing

Base unit: **4px** (Tailwind default). All spacing uses multiples.

```
Micro:     4px   (gap between icon and label, badge padding)
Component: 8px   (button padding vertical, input padding)
Inner:     12px  (card padding small, list item padding)
Standard:  16px  (card padding default, form group spacing)
Section:   24px  (between tool sections)
Major:     32px  (between distinct areas)
Layout:    48px  (page-level spacing)
```

---

## Typography

**Rule: All data values use Geist Mono. Always.**

If it's a hash, a number, a token, a key, a timestamp, a hex value — it's monospace. This is non-negotiable. The mono font is how users know they're looking at data vs. UI chrome.

```
Font families:
  UI:   Geist (sans)
  Data: Geist Mono (mono) — hashes, values, code, keys, timestamps

Text scale:
  Page title:    20px / 600 weight / tight tracking (-0.02em)
  Section head:  14px / 600 weight / tight tracking (-0.01em)
  Body:          14px / 400 weight / normal
  Label:         12px / 500 weight / wide tracking (+0.01em) / text-secondary
  Data value:    13px / 400 weight / Geist Mono / tabular-nums
  Code:          13px / 400 weight / Geist Mono
  Caption:       11px / 400 weight / text-tertiary
```

---

## Border Radius

Sharper feels technical. This product IS technical.

```
--radius-sm:  4px   (inputs, buttons, badges)
--radius-md:  6px   (cards, panels)
--radius-lg:  8px   (modals, dropdowns)
--radius-xl:  12px  (large containers)
```

---

## Component Patterns

### Tool Page Layout

The input/output transform is the heart. Input panel is compact — its job is to receive. Output panel is expansive — its job is to display the result.

```
[Tool header: icon + name + description]
[────────────────────────────────────────]
[Input panel: labeled, compact           ]
[Action bar: mode toggles + transform btn]
[Output panel: full result, copy btn     ]
```

Input has bg-inset treatment. Output has bg-raised treatment. The action bar between them reinforces the pipe metaphor.

### Tool Grid Card

NOT: icon-left / name-right / description-below.
USE: name top-left, category badge top-right, description mid, bottom border = category color notch.

```
┌─────────────────────────────┐
│ Tool Name          [Format] │  ← category badge in category color
│                             │
│ Short description of what   │
│ this tool does.             │
│                             │
├═════════════════════════════┤  ← 2px bottom border in category color
```

### Input/Output Panels

```
Label (12px / 500 / wide tracking / text-secondary)
┌─────────────────────────────────────────────────┐
│ bg-inset / border-default / radius-sm           │  ← Input
│ Geist Mono for data, Geist for prose            │
└─────────────────────────────────────────────────┘

Label (12px / 500 / wide tracking / text-secondary) + [Copy]
┌─────────────────────────────────────────────────┐
│ bg-raised / border-default / radius-sm          │  ← Output
│ Always Geist Mono                               │
└─────────────────────────────────────────────────┘
```

### Buttons

Three levels:
- **Primary action** (Transform/Generate/Calculate): bg-accent text-bg-base, hover: bg-accent-dim
- **Secondary** (mode toggles, options): bg-bg-overlay border-default text-primary, hover: bg-raised
- **Ghost** (Copy, Clear): no background, text-secondary, hover: text-primary + bg-overlay

### Status Badges / Category Labels

Small pill, 12px / 500, wide tracking, no icon. Background = category-accent-bg, text = category-accent, border = category-accent-border (20% opacity).

---

## Interaction States

Every interactive element must have all 5 states: default / hover / active / focus / disabled.

Data states: loading (skeleton with animated opacity) / empty (centered label + tertiary text) / error (signal-err border + error text below).

Focus: 2px accent ring, offset 2px. Visible in keyboard navigation. Never hidden.

---

## Animations

Fast micro-interactions. Professional — no bounce, no spring.

```
Hover:          80ms ease-out
Button press:   40ms ease-in
Expand/collapse: 150ms ease-out
Page transition: 200ms ease-in-out (current view-transition)
```

---

## What to Avoid

- Shadows on any surface (borders only)
- Mixing font families for data vs UI chrome — always mono for data
- Category colors in content areas — only for labels/badges/indicators
- Multiple accent colors competing — teal is the only interactive accent
- Dramatic border contrast — borders should be findable, not prominent
- Pure white surfaces in light mode — use tinted whites
- Bold used for emphasis mid-sentence — use text-secondary instead
