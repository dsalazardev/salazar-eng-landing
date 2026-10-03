---
name: SALAZAR Eng. Blueprint
colors:
  surface: '#F8FAFC'
  surface-container-lowest: '#FFFFFF'
  surface-container: '#FFFFFF'
  on-surface: '#0B2545'
  on-surface-variant: '#64748B'
  outline: '#CBD5E1'
  outline-variant: '#CBD5E1'
  primary: '#0B2545'
  on-primary: '#FFFFFF'
  primary-container: '#16345E'
  on-primary-container: '#FFFFFF'
  secondary: '#64748B'
  on-secondary: '#FFFFFF'
  secondary-container: '#CBD5E1'
  on-secondary-container: '#0B2545'
  tertiary: '#1D4ED8'
  on-tertiary: '#FFFFFF'
  inverse-surface: '#0B2545'
  inverse-on-surface: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 60px
    fontWeight: '700'
    lineHeight: 63px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: '0'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-base:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.2em
  badge-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  xs: 0.125rem
  sm: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section-y: 96px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 24px
  container: 1152px
---

## Brand & Style

**SALAZAR Eng. Blueprint** is the visual language of a boutique software engineering studio. It reads like a technical drawing: a calm, paper-light surface, deep navy ink, hairline rules, and small monospaced annotations that index every section like a blueprint sheet. The mood is industrial, precise, and honest — no decorative gradients, no drop shadows, no marketing ornamentation. The interface is the first proof of the engineering discipline the studio sells.

The system is deliberately monochrome: deep navy carries structure and text, steel gray carries secondary information, and a single saturated blue is rationed strictly to calls to action and hover states. Depth is expressed through borders, background shifts (paper → white → navy) and drafting textures (30px grid, 16px dot pattern, corner registration marks) rather than elevation. Whitespace is generous and rhythmic, so each section reads as a cleanly dimensioned plan.

## Colors

- **Navy Anchor (#0B2545)** — the primary ink: headings, body emphasis, dark inverted sections, navbar wordmark. Also the background of the final CTA and footer.
- **Deep Navy (#16345E)** — hover/darker companion of the anchor; reserved for gradients and interactive darkening (primary button hover).
- **Steel Gray (#64748B)** — secondary text: subheadings, supporting paragraphs, captions, technical annotations.
- **Paper Surface (#F8FAFC)** — the default page background; cool, light, drafting-paper feel.
- **Pure White (#FFFFFF)** — card and panel surfaces that lift content without shadows; also the "inverted" text color on navy.
- **Drafting Line (#CBD5E1)** — all hairline borders, section separators, blueprint rules, and the line that extends from section labels.
- **Action Blue (#1D4ED8)** — the only saturated color. Strictly reserved for primary buttons, active/focus rings, link hover, and text selection. Never used for decoration.

Inverted (navy) contexts keep the same roles with white at 60–70% opacity replacing steel gray for secondary text, and white/10–15% for hairlines.

## Typography

**Manrope Variable** carries all reading text — headings, paragraphs, buttons, navigation. Its slightly technical, geometric-humanist character keeps the industrial tone while staying highly legible. **JetBrains Mono Variable** is the annotation voice of the system: section indices (`01/ NAVBAR`, `02/ HERO`), uppercase technical badges, metric callouts, and micro-captions. It is never used for body copy.

Hierarchy is built with weight and scale contrast, not color: display headlines are bold with tight tracking (-0.025em) and tight leading (1.05) for an engineered look; body copy stays regular with relaxed leading (1.5–1.55). Labels and badges are always uppercase with wide letter-spacing (0.05em–0.2em). Text is left-aligned and never centered in content sections.

## Layout & Spacing

Layout follows a strict 4px baseline with a comfortable rhythm. Content lives in a centered **1152px container** with 16px side padding on mobile and 24px from the small breakpoint up. Sections separate with 64px of vertical padding on mobile and 96px from the large breakpoint; alternating sections are divided by 1px drafting lines (`border-y`) instead of shadows.

The dominant compositions are a 12-column grid (7/5 text-to-visual hero split), a two-column comparison list (problem → answer), a bento grid for services (one wide featured cell + two equal cells), and stacked full-width case cards with a side diagram column. The desktop hero occupies nearly the full first viewport height; all grids collapse to a single column on mobile with the same spacing rhythm.

## Elevation & Depth

There are **no drop shadows** anywhere. Depth is communicated in four ways: hairline borders on every surface, background layering (paper surface → white card → navy inverted section), translucent sticky navigation (80% surface with a subtle backdrop blur over content), and drafting textures (blueprint grid, dot pattern, registration marks at card corners). The result is a flat, printed-drawing aesthetic where structure is drawn, not stacked.

## Shapes

Corners are technical and tight. Interactive elements and containers use a **6px radius** (`rounded-md`); badges and small chips use **4px** (`rounded-sm`); 2px appears rarely. There are no pill-shaped controls except where a full-round shape is semantically required, and no large soft radii — the geometry stays precise and machined.

## Components

### Buttons
Primary buttons: solid Action Blue fill, white label, semibold, 6px radius, medium (20px/10px padding, 14px text) or large (24px/12px, 16px) size; hover darkens to Navy Anchor. Secondary buttons: transparent with a 20%-navy hairline border and navy label; hover shifts border and text to Action Blue. Buttons never have shadows; focus is a 2px Action Blue outline with 2px offset.

### Cards
White surface, 1px Drafting Line border, 6px radius, 24px internal padding (32px on featured cells). No shadow; optional hover state only changes the border to 30% navy. Cards are used as bento cells, case containers and form panels, and often carry corner "+" registration marks when they frame technical visuals.

### Badges & Chips
Monospaced, uppercase, 12px, 4px radius, hairline border, steel gray text, 10px/4px padding. Used for stack technologies and status labels. Metric callouts inside case studies use the same mono voice but bolder navy text and a slightly stronger border to read as measured evidence.

### Section Labels
Every section opens with a blueprint label: a mono index and name (`05/ SERVICIOS`) at 12px uppercase with 0.2em tracking in steel gray, followed by a hairline that extends to the container edge. This is the signature navigation motif of the system.

### Navigation
Sticky top bar, 64px tall, translucent paper surface with backdrop blur and a bottom hairline. Left: text wordmark ("SALAZAR" bold navy + "Eng." in mono steel). Center: 14px semibold links that shift to Action Blue on hover. Right: primary button. On mobile the links collapse into a full-screen popover menu triggered by an icon button.

### Inputs & Forms
White background, 1px Drafting Line border, 6px radius, 10px/12px padding, 16px text; placeholder in steel gray. Focus uses the global 2px Action Blue outline. Labels sit directly above fields in 14px semibold navy. Forms are intentionally minimal (two fields) and always paired with a trust microcopy line in mono uppercase.

### Technical Diagrams (C4)
Architecture diagrams are drawn as inline SVG in the blueprint language: 1px lines in Drafting Line / steel gray, mono 7–9px labels, dashed frames for external systems, and arrow markers. They are illustrations of engineering rigor, not decorative graphics.

### Blueprint Textures
Two utility textures recur: a 30px square grid at 5% navy opacity, and a 16px dot pattern at 15% navy opacity. They are used with soft masks inside hero visuals and section backgrounds, never at full opacity.

## Design System Notes for Stitch Generation

### Language to Use
"Industrial blueprint aesthetic", "technical drawing", "paper-light surface with deep navy ink", "hairline rules", "monospaced annotations", "generous whitespace", "flat, no shadows", "precise machined corners", "monochrome with a single rationed action blue".

### Color References
Navy Anchor for structure and dark inverted sections; Steel Gray for secondary text; Paper Surface as canvas; Pure White for cards; Drafting Line for every border; Action Blue only for CTAs, focus and hover. Never introduce additional hues, gradients or shadows.

### Component Prompts
- "A B2B engineering landing hero: deep navy headline on a paper-light canvas, hairline rule with a mono `02/ HERO` index label above it, two CTAs (one solid action blue, one outlined navy hairline), a technical grid card with registration marks on the right."
- "A services bento grid with one wide featured card and two equal cards; white surfaces, 1px drafting-line borders, 6px corners, mono uppercase labels, stack badges with hairline borders."

### Incremental Iteration
Keep edits structural: adjust hierarchy, spacing and grouping rather than adding ornament. New components should reuse the existing border/background language and mono annotation voice; any new color, shadow or radius is out of system.
