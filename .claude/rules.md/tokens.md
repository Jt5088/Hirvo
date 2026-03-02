# Design Tokens Reference
Full token list in `styles/tokens.css`. All values must come from here — never hardcode.

## Backgrounds & Surfaces
| Token | Value | Use |
|---|---|---|
| `--bg` | `#09090B` | Page background (warm near-black) |
| `--surf` | `#131316` | Card surfaces |
| `--surf2` | `#1C1C21` | Elevated card surfaces |

## Borders
| Token | Value |
|---|---|
| `--bdr` | `rgba(255,255,255,0.07)` |
| `--bdr2` | `rgba(255,255,255,0.11)` |
| `--bdr3` | `rgba(255,255,255,0.20)` |

## Accent (focus outlines only — NOT for glows or fills)
| Token | Value |
|---|---|
| `--acc` | `#7363FF` |
| `--acc2` | `#9B8FFF` |

## CTA
| Token | Value |
|---|---|
| `--cta` | `#FFFFFF` |
| `--cta2` | `#F5F3EF` |
| `--cta-hover` | `#E8E5E0` |
| `--cta-text` | `#09090B` |
| `--cta-glow` | `rgba(255,255,255,0.06)` |

## Status Colors
| Token | Value |
|---|---|
| `--green` / `--green2` / `--green3` | `#34D399` / `#4ADE80` / `#22C55E` |
| `--red` / `--red2` | `#F87171` / `#EF4444` |
| `--amber` / `--amber2` | `#FBBF24` / `#F97316` |

## Window Chrome Dots
| Token | Value |
|---|---|
| `--dot-close` | `#FF5F57` |
| `--dot-min` | `#FFBD2E` |
| `--dot-max` | `#28CA41` |

## Shadows (Josh Comeau 4-layer stack)
| Token | Value |
|---|---|
| `--shadow-near` | `rgba(0,0,0,0.55)` |
| `--shadow-mid` | `rgba(0,0,0,0.35)` |
| `--shadow-far` | `rgba(0,0,0,0.22)` |
| `--shadow-ambient` | `rgba(0,0,0,0.14)` |

## Highlights (inset top edge light)
| Token | Value |
|---|---|
| `--highlight` | `rgba(255,255,255,0.08)` |
| `--highlight-hover` | `rgba(255,255,255,0.12)` |
| `--icon-glow` | `rgba(237,237,236,0.05)` |

## Text Hierarchy
| Token | Value |
|---|---|
| `--t1` | `#EDEDEC` (warm off-white) |
| `--t2` | `rgba(237,237,236,0.64)` |
| `--t3` | `rgba(237,237,236,0.32)` |
| `--t4` | `rgba(237,237,236,0.16)` |

## Motion
| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(0.16,1,0.3,1)` |
| `--ease-out` | `cubic-bezier(0.33,1,0.68,1)` |
| `--d1` | `150ms` |
| `--d2` | `280ms` |
| `--d3` | `450ms` |
| `--d4` | `750ms` |
| `--d5` | `1000ms` |

## Card Depth Pattern (applied to all cards/widgets)
```css
border: 1px solid transparent;
background: linear-gradient(var(--surf), var(--surf)) padding-box,
            linear-gradient(180deg, var(--bdr2) 0%, transparent 100%) border-box;
box-shadow:
  inset 0 1px 0 var(--highlight),
  0 1px 2px var(--shadow-near),
  0 4px 8px var(--shadow-mid),
  0 12px 24px var(--shadow-far),
  0 24px 48px var(--shadow-ambient);
```
