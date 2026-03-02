# Design Rules

## Philosophy
This site targets Linear/Cursor-level quality. Avoid anything that reads as "AI SaaS template":
- No purple/teal glows or fills — `--acc` is for focus outlines **only**
- No centered box-shadows with colored rgba
- No uniform fadeUp on every element
- No dot grid backgrounds
- Warm near-black backgrounds (`#09090B`), not blue-black
- White CTAs on dark — maximum contrast, zero gimmick
- Directional shadows from a virtual light source (top-left), not colored glows
- 3D perspective tilt on product screenshots (`.ui-frame`)

## Token Rules
All colors, spacing, timing, and easing **must** reference `styles/tokens.css`. Never hardcode hex values, raw `ms`/`s` timing, or rgba() colors in component CSS or JS.

### Quick Reference
| Group | Key Tokens |
|---|---|
| Backgrounds | `--bg:#09090B` `--surf:#131316` `--surf2:#1C1C21` |
| Borders | `--bdr` `--bdr2` `--bdr3` (white at 7/11/20% opacity) |
| Accent | `--acc:#7363FF` `--acc2:#9B8FFF` (focus outlines only) |
| CTA | `--cta:#FFFFFF` `--cta-hover:#E8E5E0` `--cta-text:#09090B` |
| Status | `--green:#34D399` `--red:#F87171` `--amber:#FBBF24` |
| Window dots | `--dot-close:#FF5F57` `--dot-min:#FFBD2E` `--dot-max:#28CA41` |
| Shadows | `--shadow-near` `--shadow-mid` `--shadow-far` `--shadow-ambient` |
| Highlights | `--highlight:rgba(255,255,255,0.08)` `--highlight-hover:0.12` |
| Text | `--t1:#EDEDEC` `--t2:64%` `--t3:32%` `--t4:16%` opacity |
| Motion | `--ease` `--ease-out` `--d1:150ms` → `--d5:1000ms` |

Full token values: `.claude/tokens.md`

## Card Depth Pattern
Apply to every card, widget, and icon container:
```css
border: 1px solid transparent;
background: linear-gradient(var(--surf), var(--surf)) padding-box,
            linear-gradient(180deg, var(--bdr2) 0%, transparent 100%) border-box;
box-shadow:
  inset 0 1px 0 var(--highlight),     /* top edge highlight */
  0 1px 2px var(--shadow-near),        /* contact shadow */
  0 4px 8px var(--shadow-mid),         /* close shadow */
  0 12px 24px var(--shadow-far),       /* medium spread */
  0 24px 48px var(--shadow-ambient);   /* ambient falloff */
```
On hover: brighten inset to `var(--highlight-hover)`, lift with `translateY(-4px)`.

## Animation Rules
- Prefer animating `transform` and `opacity` only — never `width`, `height`, `top`, `left`
- All durations must use `--d1` through `--d5` tokens
- All easings must use `--ease` or `--ease-out`
- Every animation must have a `prefers-reduced-motion` fallback
- `.ui-frame` showcase widgets use `perspective(1200px) rotateX(3deg)` at rest, `rotateX(1deg) translateY(-6px)` on hover
