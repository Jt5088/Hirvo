# Light Diffusion Research: Natural Glow in CSS and JS

**Project:** Hirvo Landing Page
**Date:** 2026-03-02
**Purpose:** Reference guide for implementing physically plausible, natural-looking light diffusion in the dark-themed Hirvo UI using CSS/JS/WebGL — without blocks, intervals, or harsh edges.

---

## Table of Contents

1. [Physics of Light Diffusion](#1-physics-of-light-diffusion)
2. [Why Light Looks Fake in Code](#2-why-light-looks-fake-in-code)
3. [Core CSS Techniques](#3-core-css-techniques)
4. [The Eased Gradient Technique (Scrim)](#4-the-eased-gradient-technique-scrim)
5. [Layered Box-Shadow for Natural Falloff](#5-layered-box-shadow-for-natural-falloff)
6. [Blend Modes for Light Interaction](#6-blend-modes-for-light-interaction)
7. [Animated Light with @property](#7-animated-light-with-property)
8. [WebGL and Canvas for Per-Pixel Lighting](#8-webgl-and-canvas-for-per-pixel-lighting)
9. [Anti-Patterns Checklist](#9-anti-patterns-checklist)
10. [Performance Notes](#10-performance-notes)
11. [Quick Reference Checklist for Agents](#11-quick-reference-checklist-for-agents)
12. [Hirvo-Specific Application Notes](#12-hirvo-specific-application-notes)

---

## 1. Physics of Light Diffusion

Understanding why real light behaves the way it does is the foundation for getting it right in code.

### 1.1 Inverse Square Law

The intensity of a point light source falls off with the square of the distance from the source:

```
I = P / (4π × r²)
```

Where `I` is intensity, `P` is power, and `r` is radius. The practical implication: doubling the distance from a light source reduces brightness to **one quarter**, not one half. This non-linear falloff is why real light looks warm and concentrated near the source and then drops off fast rather than fading uniformly.

**CSS approximation:** A linear radial gradient from white to transparent is wrong. The center should be much brighter relative to the mid-range, and the fade should be steep early then gradually flatten. This is what makes the difference between a bloom that looks like a light and one that looks like a soft eraser mark.

### 1.2 Gaussian Light Spread

In photographic and rendering terms, light from an extended source (not a point) spreads with a Gaussian (bell curve) distribution. The Gaussian function:

```
f(x) = e^(−x² / 2σ²)
```

This means:
- The center is the absolute peak
- Falloff is rapid at first (fast drop after center)
- Falloff slows significantly at the edges (long, subtle tail)

A real Gaussian applied to CSS would use more stops near the center and stretch the falloff over a large radius. Standard browser radial gradients are "cheap Gaussians" — they are approximately Gaussian between two color stops, but a single two-stop gradient is not enough to look believable.

### 1.3 Fresnel Effect

In physical rendering, the Fresnel effect describes how surfaces reflect more light at glancing angles than at direct angles. On 2D UI cards, this translates to: edges of cards catch more ambient light than the flat face. This is why:
- A single radial gradient centered on a card looks like a headlight, not a real surface
- The top edge of cards should carry more highlight than the center face
- Card rim highlights should be brighter at corners

In CSS, this is approximated with:
- Inset top-edge box-shadow or a `highlight` token on `border-top`
- Gradient borders that are bright at the top and fade to near-invisible at the bottom (which Hirvo already does correctly on `.ui-frame`)
- A small interior radial gradient positioned at the upper-left corner, not dead center

### 1.4 Subsurface Scattering (SSS) — Conceptual CSS Equivalent

SSS in 3D rendering describes how light enters a surface, bounces internally, and exits at different points — giving skin, wax, marble their translucent glow. In 2D CSS, this is irrelevant for opaque cards but becomes useful for:
- Glowing elements with `backdrop-filter` that allow the background to bleed through
- Translucent modal overlays where the background color "bleeds" into the surface

The CSS equivalent of SSS is stacking a transparent colored radial gradient on top of a blurred background (blur + radial gradient composite = scattering approximation).

---

## 2. Why Light Looks Fake in Code

These are the specific technical causes of artificial-looking glow and bloom in dark UI.

### 2.1 Single-Layer Glow

```css
/* BAD — single box-shadow with large blur */
box-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
```

A single Gaussian-blurred shadow creates a uniform soft halo with no depth gradient. Real light has a dense, bright core that thins rapidly then extends a long, very faint tail. One layer cannot simulate two regions of the falloff curve.

### 2.2 Linear Color Stops in Radial Gradients

```css
/* BAD — two-stop radial with abrupt transition */
background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 100%);
```

Between 0% and 100%, the browser interpolates linearly. But light intensity follows an inverse-square or Gaussian curve. The result is a gradient that is too dim near the center and too bright/prolonged near the edge — the opposite of real light.

### 2.3 Uniform Opacity Without Falloff

A glow element with `opacity: 0.3` and a large `filter: blur(40px)` has no falloff differentiation. The glow energy is distributed flat across the blurred area. Real light concentrates energy at the source and dissipates it.

### 2.4 Hard Color Stops

```css
/* BAD — color stop at 60% creates a visible ring */
background: radial-gradient(circle, white 0%, white 60%, transparent 61%);
```

Any place two stops are at the same position creates a visible edge. Even gradual transitions have banding artifacts if the color values jump too much between stops.

### 2.5 Insufficient Blur Spread Relative to Source

A glow with `blur: 10px` on a 200px card will appear as a tight halo. Real light from an area source diffuses significantly. The blur radius should usually be 20–80% of the affected element's dimensions to feel like ambient scatter rather than a tight point source.

### 2.6 Wrong Blend Mode for Light

`mix-blend-mode: normal` means the glow element simply occludes what is behind it. Real light is **additive** — it brightens what is underneath. The correct blend mode for light is `screen` or `plus-lighter`. Using `normal` makes glows feel like tinted overlays, not light.

### 2.7 Gradient Banding

On dark backgrounds (Hirvo uses `#09090B`), banding is especially visible because the eye is extremely sensitive to subtle luminance differences in near-black regions. Banding occurs when:
- Too few color stops span a large luminance range
- Stops are placed at equal intervals (linear distribution) rather than at easing curve intervals

---

## 3. Core CSS Techniques

### 3.1 Stacked Radial Gradients (Layered Bloom)

The most important technique for natural light diffusion: stack multiple radial gradients, each representing a different "zone" of the light source — tight core, mid field, ambient scatter.

```css
/* Natural 3-zone bloom — core + mid + ambient */
.glow-element {
  background:
    /* Zone 1 — tight, bright core */
    radial-gradient(ellipse 20% 15% at 50% 40%,
      rgba(237,237,236,0.18) 0%,
      rgba(237,237,236,0.06) 50%,
      transparent 100%),
    /* Zone 2 — mid-field scatter */
    radial-gradient(ellipse 55% 40% at 50% 35%,
      rgba(237,237,236,0.06) 0%,
      rgba(237,237,236,0.015) 60%,
      transparent 100%),
    /* Zone 3 — ambient spill, very large, very dim */
    radial-gradient(ellipse 90% 70% at 50% 20%,
      rgba(237,237,236,0.025) 0%,
      transparent 100%);
}
```

**Why this works:** Each gradient independently contributes to a different part of the inverse-square falloff curve. Zone 1 handles the steep near-field drop. Zone 2 approximates the mid-range plateau. Zone 3 is the long-tail ambient scatter that real light always produces. Together they create a curve that no single gradient can reproduce.

**Hirvo application:** The current `.hero-glow` already uses 3 stacked radial gradients — this is correct architecture. The opacity values could be tuned to increase the core contrast vs. ambient spread ratio.

### 3.2 Multiple Pseudo-Element Layers for Glow

Use `::before` and `::after` (and additional elements where needed) to separate concerns:

```css
.glowing-card {
  position: relative;
}

/* Layer 1 — large ambient scatter (far field) */
.glowing-card::before {
  content: '';
  position: absolute;
  inset: -60px -40px;
  background: radial-gradient(ellipse 80% 60% at 50% 30%,
    rgba(237,237,236,0.04) 0%,
    transparent 100%);
  filter: blur(8px);   /* additional softening on the far field */
  pointer-events: none;
  z-index: -1;
}

/* Layer 2 — tight core bloom on the card face */
.glowing-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 40% at 38% 28%,
    rgba(237,237,236,0.09) 0%,
    transparent 70%);
  border-radius: inherit;
  pointer-events: none;
}
```

**Key principle:** The far-field layer extends beyond the card boundary (`inset: -60px`), simulating ambient light spill onto the surrounding page. The near-field layer stays within the card.

### 3.3 Inset Shadows for Surface Curvature

Box-shadow with the `inset` keyword simulates how light falls on a concave surface — brighter at the rim, dimmer toward the center:

```css
.card {
  box-shadow:
    /* Top-edge specular (Fresnel-like highlight) */
    inset 0 1px 0 rgba(255,255,255,0.12),
    /* Interior ambient fill — very subtle, warm */
    inset 0 20px 40px -20px rgba(255,255,255,0.02);
}
```

The second inset layer (`0 20px 40px -20px`) creates a diffuse warm pool in the upper portion of the card without any element boundary or harsh edge. The negative spread (`-20px`) collapses the solid core so only the blur tail shows.

### 3.4 The `filter: blur()` Bloom Technique

A blurred element behind content creates a soft light bloom without any gradient math:

```css
.bloom-behind {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(237, 237, 236, 0.15);
  filter: blur(40px);
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}
```

**Performance note:** `filter: blur()` cost scales quadratically with blur radius. A 40px blur on a 120px element is much cheaper than a 40px blur on the full viewport. Keep blurred elements small and extend them visually with large blur radius.

### 3.5 `backdrop-filter` for Transmitted Light

On glass-style surfaces, `backdrop-filter: blur()` simulates transmitted light scattering through a translucent medium:

```css
.glass-panel {
  background: rgba(19, 19, 22, 0.6);  /* semi-transparent */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /* Add a light gradient on top to simulate light entry angle */
  background-image: linear-gradient(
    135deg,
    rgba(255,255,255,0.04) 0%,
    transparent 50%
  );
}
```

The combination of semi-transparent background + backdrop blur + a small directional gradient on top approximates how light enters a glass surface from one direction, diffuses through, and exits uniformly.

---

## 4. The Eased Gradient Technique (Scrim)

This is the most scientifically grounded CSS technique for natural light falloff. Rather than using a two-stop gradient (which is linear), you distribute color stops along an easing curve.

### 4.1 The Scrim (Material Design) Alpha Values

The following 13-stop pattern (derived from Material Design guidelines and Andreas Larsen's research) produces a gradient that matches how light naturally fades from a surface:

```css
/* Scrim gradient: opaque center (or top) → transparent edge
   Uses ease-in-out-sine-like distribution of alpha values */
background: linear-gradient(
  to bottom,
  rgba(237,237,236,1.000) 0%,
  rgba(237,237,236,0.738) 19%,
  rgba(237,237,236,0.541) 34%,
  rgba(237,237,236,0.382) 47%,
  rgba(237,237,236,0.278) 56.5%,
  rgba(237,237,236,0.194) 65%,
  rgba(237,237,236,0.126) 73%,
  rgba(237,237,236,0.075) 80.2%,
  rgba(237,237,236,0.042) 86.1%,
  rgba(237,237,236,0.021) 91%,
  rgba(237,237,236,0.008) 95.2%,
  rgba(237,237,236,0.002) 98.2%,
  rgba(237,237,236,0.000) 100%
);
```

**When to apply in radial gradients:** The same alpha progression applies to radial gradients by treating the gradient radius as the distance dimension. For a glow that starts at `rgba(255,255,255,0.12)` at the center, multiply each stop's alpha by 0.12 to get the correctly eased values.

### 4.2 Inverse-Square Approximation Stops

For a more physically accurate falloff (closer to the inverse-square law than the Gaussian scrim), use this distribution which drops faster near the source:

```css
/* Inverse-square-inspired: drops to 25% intensity by 50% radius */
radial-gradient(circle,
  rgba(237,237,236,0.14) 0%,     /* source: full intensity */
  rgba(237,237,236,0.11) 10%,    /* r=0.1: ~80% */
  rgba(237,237,236,0.07) 25%,    /* r=0.25: ~50% */
  rgba(237,237,236,0.035) 45%,   /* r=0.45: ~25% */
  rgba(237,237,236,0.012) 65%,   /* r=0.65: ~9% */
  rgba(237,237,236,0.003) 82%,   /* r=0.82: ~2% */
  transparent 100%
)
```

The alpha values follow roughly `a(r) = a_0 / (1 + k*r²)` where `k` controls how quickly the light drops off. This is more concentrated at the center than a scrim, which is appropriate for a directional spot light rather than an ambient field.

### 4.3 Fix for Gradient Banding

On Hirvo's near-black background (`#09090B`), banding is a real risk. Mitigations:

**Method 1 — More stops in the sensitive range:**
Add extra stops in the 0%–30% region where the eye is most sensitive to dark-value changes.

**Method 2 — Noise overlay:**
Apply a 1–2% opacity noise texture over the gradient area to break up banding:
```css
.gradient-with-noise {
  position: relative;
}
.gradient-with-noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.015;
  pointer-events: none;
}
```

**Method 3 — Blur smearing:**
A very small `filter: blur(0.5px)` on the gradient element smooths out pixel-level banding without visible softening at normal viewing distances.

---

## 5. Layered Box-Shadow for Natural Falloff

The layered shadow technique, documented by Tobias Ahlin, uses exponentially scaling layers to produce a Gaussian-shaped shadow profile from a series of simpler blur operations.

### 5.1 The Exponential Doubling Pattern

Each shadow layer doubles its blur radius and Y-offset, with constant opacity per layer:

```css
/* Tobias Ahlin's 5-layer smooth shadow — good for card depth */
box-shadow:
  0 1px 1px rgba(0,0,0,0.12),
  0 2px 2px rgba(0,0,0,0.12),
  0 4px 4px rgba(0,0,0,0.12),
  0 8px 8px rgba(0,0,0,0.12),
  0 16px 16px rgba(0,0,0,0.12);
```

Total perceived opacity ≈ `1 - (1-0.12)^5 ≈ 0.48` — similar to a single `0.48` shadow, but the distribution is far smoother.

### 5.2 Hirvo Card Enhancement Pattern

Applying the principle to Hirvo's current card system (which already has a 3-layer shadow):

```css
/* Current Hirvo .ui-frame box-shadow — 3 layers */
box-shadow:
  inset 0 1px 0 var(--highlight),
  0 2px 4px var(--shadow-near),
  0 8px 16px var(--shadow-mid),
  0 24px 48px var(--shadow-far);

/* Enhanced version — 5 layers for smoother depth gradient */
box-shadow:
  inset 0 1px 0 var(--highlight),           /* Fresnel top edge */
  0 1px 2px var(--shadow-near),             /* tight contact shadow */
  0 3px 6px rgba(0,0,0,0.30),              /* near field */
  0 8px 16px var(--shadow-mid),             /* mid field */
  0 20px 40px var(--shadow-far),            /* far field */
  0 40px 80px var(--shadow-ambient);        /* ambient scatter */
```

### 5.3 Glow-Shadow Combination (Light from Above)

For the appearance that a card is illuminated from above by a soft overhead light:

```css
.illuminated-card {
  box-shadow:
    /* Tight under-card shadow (physical contact) */
    0 1px 2px rgba(0,0,0,0.55),
    /* Spreading lift shadow */
    0 4px 8px rgba(0,0,0,0.35),
    0 12px 24px rgba(0,0,0,0.22),
    0 32px 48px rgba(0,0,0,0.14),
    /* Upward glow: negative Y-offset, very faint */
    0 -2px 20px rgba(237,237,236,0.03);
}
```

The last shadow (negative Y-offset) creates the faintest upward scatter — the light from the page "bouncing back" up toward the card base. This should be barely perceptible: `0.03` opacity max.

---

## 6. Blend Modes for Light Interaction

### 6.1 `mix-blend-mode: screen` — Additive Light

`screen` makes dark areas transparent and bright areas additive. It is the correct blend mode for light sources overlaid on dark backgrounds:

```css
.light-source {
  position: absolute;
  background: radial-gradient(circle,
    rgba(237,237,236,0.25) 0%,
    transparent 70%
  );
  mix-blend-mode: screen;  /* adds brightness rather than covering */
  pointer-events: none;
}
```

Without `mix-blend-mode: screen`, the radial gradient is a translucent layer that averages with what is below. With `screen`, it **adds** light — dark areas of the card show through fully, bright areas of the gradient intensify the card's own brightness. This is physically correct.

**Caution:** `screen` blending creates new stacking contexts, which can interfere with z-index and `overflow: hidden`. Test carefully.

### 6.2 `mix-blend-mode: plus-lighter` — True Additive

`plus-lighter` is the mathematically correct additive blend: `result = min(1, a + b)`. It is more aggressive than `screen` and best for bright point sources like the aurora shader already in Hirvo:

```css
.aurora-canvas {
  mix-blend-mode: plus-lighter; /* or screen — both work for aurora */
  opacity: 0.35;  /* modulate the overall energy */
}
```

### 6.3 `mix-blend-mode: color-dodge` — Specular Highlights

`color-dodge` produces blown-out highlights and is best for specular point-light reflections (like a small catch-light on a rounded edge). Do not use it for large area glows — it oversaturates and looks radioactive. Reserve for 4–16px radius tight-point sources only.

### 6.4 `mix-blend-mode: soft-light` — Subtle Surface Modulation

`soft-light` is the gentlest blend mode for lighting. Values above 50% gray brighten; below 50% darken. It is useful for creating the sense that a surface has slightly non-uniform reflectivity without making any area glow:

```css
/* Adds warmth to top of card without full brightening */
.card-surface-modulation::after {
  background: linear-gradient(180deg,
    rgba(180,180,180,0.15) 0%,  /* >50% gray = subtle brighten */
    rgba(100,100,100,0.1) 100%  /* <50% gray = subtle darken */
  );
  mix-blend-mode: soft-light;
}
```

---

## 7. Animated Light with @property

### 7.1 Why Regular CSS Variables Cannot Animate Gradients

```css
/* This does NOT animate smoothly — browser treats the whole value as a string */
.card {
  --glow-pos: 50%;
  background: radial-gradient(circle at var(--glow-pos) 50%, white, black);
  transition: --glow-pos 0.5s;
}
```

The browser cannot interpolate between two string values. The gradient snaps rather than transitions.

### 7.2 The @property Solution

Registering the custom property with a type declaration tells the browser to interpolate numerically:

```css
@property --glow-x {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 50%;
}

@property --glow-y {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 30%;
}

@property --glow-opacity {
  syntax: '<number>';
  inherits: false;
  initial-value: 0.08;
}

.card {
  background: radial-gradient(
    ellipse 60% 45% at var(--glow-x) var(--glow-y),
    rgba(237,237,236,var(--glow-opacity)) 0%,
    transparent 100%
  );
  transition:
    --glow-x 0.4s cubic-bezier(0.16,1,0.3,1),
    --glow-y 0.4s cubic-bezier(0.16,1,0.3,1),
    --glow-opacity 0.3s ease;
}

.card:hover {
  --glow-x: 38%;
  --glow-y: 25%;
  --glow-opacity: 0.14;
}
```

This enables CSS-only animated light movement that uses the GPU compositing pipeline, requiring no JavaScript.

### 7.3 JavaScript + @property for Mouse-Tracking Light

For the mouse-following card glow effect (Hirvo already has a version in `glow.js`), combining `@property` with `requestAnimationFrame` gives smooth light tracking:

```javascript
// Mouse-following glow using @property for smooth gradient animation
(function() {
  // Register the properties once at startup (or in CSS via @property rule)
  if (CSS.registerProperty) {
    CSS.registerProperty({ name: '--glow-x', syntax: '<percentage>', inherits: false, initialValue: '50%' });
    CSS.registerProperty({ name: '--glow-y', syntax: '<percentage>', inherits: false, initialValue: '30%' });
  }

  const cards = document.querySelectorAll('.ui-frame');
  let rafId = null;
  let mouseX = 0, mouseY = 0;

  document.body.addEventListener('pointermove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });

  function update() {
    rafId = null;
    cards.forEach(function(card) {
      const rect = card.getBoundingClientRect();
      const x = ((mouseX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((mouseY - rect.top) / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--glow-x', x);
      card.style.setProperty('--glow-y', y);
    });
  }
})();
```

The card CSS then uses the registered properties in a radial gradient, and CSS transitions handle the smooth movement interpolation.

### 7.4 Breathing / Pulsing Light Animation

For a slow "breathing" ambient light (like Hirvo's `.cta-glow` pulse), using `@property` enables smooth opacity animation without the `opacity` property affecting child elements:

```css
@property --glow-intensity {
  syntax: '<number>';
  inherits: false;
  initial-value: 0.04;
}

@keyframes breathe {
  0%, 100% { --glow-intensity: 0.025; }
  50%       { --glow-intensity: 0.06; }
}

.ambient-glow {
  background: radial-gradient(ellipse 60% 50% at 50% 50%,
    rgba(237,237,236,var(--glow-intensity)) 0%,
    transparent 100%
  );
  animation: breathe 8s ease-in-out infinite;
}
```

This is better than animating `opacity` on the glow element because it adjusts the light intensity in place rather than fading the entire element including its context.

---

## 8. WebGL and Canvas for Per-Pixel Lighting

When CSS cannot produce the physical accuracy needed, WebGL/Canvas provide per-pixel control.

### 8.1 When to Use WebGL vs CSS

**Use CSS when:**
- The light source is static or moves slowly
- You need at most 2–3 overlapping glow regions
- The effect is decorative and subtle

**Use WebGL/Canvas when:**
- Multiple interacting light sources are needed
- The glow shape is non-elliptical (follows object contours)
- Real-time per-pixel intensity calculation is required
- The aurora/particle shader approach (already implemented in `aurora.js`)

### 8.2 Hirvo's Existing WebGL Light (aurora.js)

The aurora shader in `aurora.js` already uses per-pixel lighting via the fragment shader. The key technique is the `tanh(pow(o/100.0, vec4(1.6)))` tone-mapping at the end of the fragment shader:

```glsl
/* Tone-mapping — compresses hot pixels to prevent overexposure */
o = tanh(pow(o / 100.0, vec4(1.6)));
gl_FragColor = o * 0.9;
```

`tanh()` here acts as a physically plausible tone-mapper: values near 0 map linearly (preserving near-black detail), while extreme values compress toward 1 (preventing washed-out blow-out). This is the shader equivalent of avoiding the `uniform opacity` anti-pattern.

### 8.3 Gaussian Light in GLSL (for Future Reference)

If a custom WebGL glow effect is needed:

```glsl
/* Gaussian falloff centered at uCenter, with sigma controlling spread */
float gaussian(vec2 pos, vec2 center, float sigma) {
  vec2 d = pos - center;
  return exp(-(dot(d,d)) / (2.0 * sigma * sigma));
}

/* Layered Gaussian — simulates 3-zone light field */
float light =
  gaussian(uv, uCenter, 0.05) * 0.8  +   /* tight core */
  gaussian(uv, uCenter, 0.15) * 0.15 +   /* mid field */
  gaussian(uv, uCenter, 0.40) * 0.05;    /* ambient scatter */
```

This maps directly to the 3-zone stacked radial gradient technique in Section 3.1, but with mathematically precise Gaussian falloff instead of CSS gradient approximation.

---

## 9. Anti-Patterns Checklist

Avoid all of these in Hirvo's implementation:

| Anti-Pattern | Why It Looks Fake | Fix |
|---|---|---|
| Single `box-shadow: 0 0 40px rgba()` | No depth gradient, uniform halo | Layer 4–6 shadows with exponentially increasing blur |
| Two-stop `radial-gradient(white, transparent)` | Linear intensity curve, not inverse-square | Add 4–6 intermediate stops following scrim curve |
| `opacity` animation on glow element | Changes transparency of everything including children | Animate `--glow-opacity` @property on the gradient instead |
| `mix-blend-mode: normal` on light element | Occludes rather than adds light | Use `screen` or `plus-lighter` for additive light |
| Animating `box-shadow` on hover with large blur | Causes repaint on every frame | Animate `opacity` on a glow pseudo-element instead |
| Same glow color as the card background | Washes out; looks like plastic | Tint toward warm neutral (use Hirvo's `--t1` at 3–8% opacity) |
| `filter: blur(60px)` on full-width element | Extremely expensive paint operation | Keep blurred elements small; extend visually with large radius |
| Equal-interval gradient stops | Produces visible banding on dark backgrounds | Use scrim curve alpha values (Section 4.1) |
| Glow extending INTO text | Washes out readability | Apply glow to `z-index: -1` layer or use inset-only techniques |
| `backdrop-filter: blur()` on elements that scroll fast | Repaints every frame during scroll | Avoid `backdrop-filter` on scrolling elements; use static fallback |
| Animating `width` or `height` of glow elements | Forces layout recalculation | Animate `transform: scale()` instead |
| `will-change: filter` on many elements simultaneously | Promotes too many layers, exhausts GPU memory | Apply `will-change` only during active animation, remove after |

---

## 10. Performance Notes

### 10.1 Paint vs Compositing — The Critical Distinction

The browser rendering pipeline has three costly stages:
1. **Layout** — recalculating geometry (most expensive)
2. **Paint** — drawing pixels (expensive, especially with filters)
3. **Composite** — combining GPU layers (cheap)

For glow effects, the goal is to stay in the **composite** tier wherever possible.

**Safe to animate (composite only):**
- `transform`
- `opacity`

**Triggers paint (acceptable if infrequent):**
- `box-shadow`
- `background-color`
- `border-color`

**Triggers paint with high cost (avoid animating):**
- `filter: blur()`
- `backdrop-filter`
- `background` (gradient changes)

**Triggers layout (never animate these):**
- `width`, `height`, `top`, `left`
- `margin`, `padding`
- `border-width`

### 10.2 The Correct Way to Animate Glows

Never animate the glow property directly. Instead, animate `opacity` on a glow pseudo-element that is always rendered:

```css
.card::after {
  content: '';
  /* Glow is always present — just invisible */
  background: radial-gradient(ellipse 70% 50% at 38% 28%,
    rgba(237,237,236,0.12) 0%,
    transparent 100%
  );
  opacity: 0;
  /* opacity transition is cheap — compositor only */
  transition: opacity var(--d3) var(--ease);
  will-change: opacity;  /* keep on its own layer */
}
.card:hover::after {
  opacity: 1;
}
```

This keeps the glow element permanently on a GPU layer (`will-change: opacity`) and only changes the compositing operation on hover — no repaint.

### 10.3 `will-change` Budget

Hirvo currently uses `will-change: transform, opacity` on `.reveal` elements and `will-change: transform` on `.hero-glow`. Each `will-change` declaration promotes the element to its own GPU layer, consuming VRAM.

**Rule:** Never have more than 8–10 `will-change` elements active simultaneously. On mobile, each 400×400px promoted layer costs ~2.5MB of GPU memory.

**Pattern for glow elements:** Apply `will-change` only during interaction:

```javascript
card.addEventListener('mouseenter', () => card.style.willChange = 'opacity');
card.addEventListener('mouseleave', () => card.style.willChange = 'auto');
```

### 10.4 `filter: blur()` Cost Model

Cost scales approximately as:
```
cost = blur_radius² × element_area
```

A 40px blur on a 400×400 element = `1600 × 160,000 = 256,000,000` operations (relative units). The same 40px blur on a 60×60 element = `1600 × 3,600 = 5,760,000` — 44x cheaper.

Keep blurred elements as small as possible and let the blur radius create the perceived size.

### 10.5 Scroll Handler Efficiency

For any glow that responds to scroll position, batch reads and writes:

```javascript
// BAD — reads rect on every scroll event, forces layout thrash
window.addEventListener('scroll', function() {
  const rect = card.getBoundingClientRect(); // read during paint
  card.style.opacity = ...; // write during paint
});

// GOOD — batched via rAF
let scrollPending = false;
window.addEventListener('scroll', function() {
  if (!scrollPending) {
    scrollPending = true;
    requestAnimationFrame(function() {
      const rect = card.getBoundingClientRect(); // read in rAF
      card.style.opacity = ...; // write in rAF
      scrollPending = false;
    });
  }
}, { passive: true });
```

---

## 11. Quick Reference Checklist for Agents

Use this checklist when implementing or auditing any glow/light effect in Hirvo:

### Physics Compliance
- [ ] Does the glow concentrate energy at the source and fall off non-linearly? (Not uniform brightness across the bloom)
- [ ] Are there at least 3 gradient stops to approximate the falloff curve? (Not just `rgba(x) 0%, transparent 100%`)
- [ ] Is the glow element positioned offset from dead center to suggest a directional light source?
- [ ] Do card top edges carry more highlight than card faces? (Fresnel approximation)

### CSS Technique
- [ ] Glow uses stacked radial gradients or layered `box-shadow` (not a single layer)
- [ ] No hardcoded hex colors — all colors reference `tokens.css` (e.g., use `rgba(237,237,236,0.06)` which is `--t1` base color)
- [ ] No hardcoded timing values — all animation durations use `var(--d1)` through `var(--d5)` from tokens
- [ ] Glow extends beyond the card boundary by 20–80px to simulate ambient scatter into the page
- [ ] Gradient banding risk assessed — if background is near-black and glow is large, use scrim-curve stops

### Blend Mode
- [ ] Light elements that should add brightness use `mix-blend-mode: screen` or `plus-lighter`
- [ ] Overlay effects that should modulate surface reflectivity use `mix-blend-mode: soft-light`
- [ ] NOT using `mix-blend-mode: normal` for any element intended to represent light

### Animation Safety
- [ ] Static glow: uses `opacity` transition on a pre-rendered pseudo-element (no gradient animation)
- [ ] Mouse-tracking glow: uses `requestAnimationFrame`, not direct event handler writes
- [ ] Pulsing glow: uses `@property` registered variable if animating gradient intensity
- [ ] `will-change` applied only to elements actively animating
- [ ] `prefers-reduced-motion` is respected — glow animations pause or show static version

### Performance
- [ ] No glow animates `width`, `height`, `top`, `left`, or `margin`
- [ ] `filter: blur()` elements are kept small (under 200×200px) with large blur radius
- [ ] Number of simultaneously promoted `will-change` layers counted — under 10
- [ ] Scroll-linked glow updates use `requestAnimationFrame` with `passive: true` listener
- [ ] `backdrop-filter` not used on elements that scroll rapidly (static sections only)

### Accessibility
- [ ] `pointer-events: none` on all decorative glow elements
- [ ] `aria-hidden="true"` on all decorative glow elements
- [ ] Glow does not reduce text contrast below WCAG AA minimum
- [ ] `prefers-reduced-motion: reduce` removes all animated glows

---

## 12. Hirvo-Specific Application Notes

### 12.1 What Hirvo Already Does Well

| File | Technique | Assessment |
|---|---|---|
| `hero.css` `.hero-glow` | 3-zone stacked radial gradients | Correct architecture. Opacities could increase by 1.5× for more presence |
| `showcase.css` `.ui-frame` box-shadow | 3-layer depth shadow | Could be extended to 5–6 layers for smoother depth gradient |
| `showcase.css` spotlight `::before` | Radial gradient ambient halo extending beyond card | Correct. The `-80px` inset extension is exactly right |
| `glow.js` | rAF-gated conic gradient on card border | Correctly uses `requestAnimationFrame` and `passive: true` |
| `hero-parallax.js` | LERP-smoothed mouse tracking | Correct pattern, stops when motion is below threshold |
| `animations.css` `.card-glow` | Conic gradient border glow | Correct use of `--glow-angle` CSS variable |
| `aurora.js` | WebGL fragment shader with `tanh()` tone-mapping | Physically plausible, IntersectionObserver-gated |

### 12.2 Current Gaps and Improvement Opportunities

**Gap 1: Single-stop glow in CTA section**
File: `/Users/josephtian/Desktop/Hirvo/website/landing-page/styles/components/cta.css`, line 9
```css
/* Current — 2-stop radial, linear falloff */
radial-gradient(ellipse 50% 55% at 50% 50%, rgba(237,237,236,0.04) 0%, transparent 100%)
```
Improvement: Add 3 intermediate stops using the scrim curve to avoid a visible "edge ring" at the gradient boundary.

**Gap 2: Orbital timeline node hover — single-layer glow box-shadow**
File: `/Users/josephtian/Desktop/Hirvo/website/landing-page/styles/components/orbital-timeline.css`, line 91
```css
/* Current — 3 shadow layers, but glow layers only 2 stops */
0 0 14px 2px rgba(var(--node-glow-rgb,200,200,220),0.28),
0 0 40px 6px rgba(var(--node-glow-rgb,200,200,220),0.10),
```
Improvement: Add a third ambient scatter layer: `0 0 80px 16px rgba(var(--node-glow-rgb),0.04)` to extend the glow tail.

**Gap 3: `.card-glow` uses `mix-blend-mode: normal` (implicit)**
File: `/Users/josephtian/Desktop/Hirvo/website/landing-page/styles/animations.css`, line 165
The `.card-glow` conic gradient element has no `mix-blend-mode` declaration, defaulting to `normal`. Adding `mix-blend-mode: screen` would make the border glow additive rather than overlaying.

**Gap 4: No scrim-curve falloff on any gradient**
None of the current gradient stops use the eased scrim progression. All existing gradients use either 2-stop or simple percentage distributions. Adding 4–6 intermediate stops to the hero glow and showcase spotlight would significantly improve naturalism.

**Gap 5: `.cta-glow` animates `opacity` on the element**
File: `/Users/josephtian/Desktop/Hirvo/website/landing-page/styles/components/cta.css`, lines 13–15
```css
/* Current — animates element opacity */
animation: ctaPulse 10s var(--ease-out) infinite;
@keyframes ctaPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
```
This is functionally correct since the element has no children, but could be converted to a `@property --pulse-intensity` animation for a more natural intensity modulation without changing the element's compositing opacity.

### 12.3 Token Alignment for Glow Colors

All glow colors in Hirvo must derive from existing tokens. The correct source colors are:

| Glow Intent | Token Base | RGBA Construction |
|---|---|---|
| Neutral warm light (card faces) | `--t1: #EDEDEC` | `rgba(237,237,236,0.04–0.12)` |
| Subtle ambient fill | `--icon-glow` | `rgba(237,237,236,0.05)` — already defined |
| Green status glow | `--green: #34D399` | `rgba(52,211,153,0.08–0.18)` |
| Amber warning glow | `--amber: #FBBF24` | `rgba(251,191,36,0.08–0.18)` |
| Surface lift highlight | `--highlight` | `rgba(255,255,255,0.08)` |
| CTA button glow | `--cta-glow` | `rgba(255,255,255,0.06)` — already defined |

Never introduce new colors for glow effects. Never use the `--acc` (purple) accent for glow — it is documented as "focus-visible outlines only."

---

## Sources

- [Smoother & sharper shadows with layered box-shadows — Tobias Ahlin](https://tobiasahlin.com/blog/layered-smooth-box-shadows/)
- [Designing Beautiful Shadows in CSS — Josh W. Comeau](https://www.joshwcomeau.com/css/designing-shadows/)
- [Easing Linear Gradients — CSS-Tricks](https://css-tricks.com/easing-linear-gradients/)
- [Making CSS Gradients Smooth — Toward Studio](https://toward.studio/latest/making-css-gradients-smooth)
- [Easing Gradients Tool — Andreas Larsen](https://larsenwork.com/easing-gradients/)
- [Creating Glow Effects with CSS — Coders Block](https://codersblock.com/blog/creating-glow-effects-with-css/)
- [Holograms, light-leaks and CSS-only shaders — Robb Owen](https://robbowen.digital/wrote-about/css-blend-mode-shaders/)
- [Blend Modes — web.dev](https://web.dev/learn/css/blend-modes)
- [We Can Finally Animate CSS Gradients — DEV Community](https://dev.to/afif/we-can-finally-animate-css-gradient-kdk)
- [Five Ways to Create Light Effects with CSS — OpenReplay Blog](https://blog.openreplay.com/five-ways-to-create-light-effects-with-css/)
- [Illuminate Your Web Design: Five CSS Tricks for Stunning Light Effects — OpenReplay](https://blog.openreplay.com/five-ways-to-create-light-effects-with-css/)
- [CSS Banding: What It Is, Why It Happens, and How to Fix It — piwebpress](https://piwebpress.com/css-banding/)
- [Radial Gradients and CSS Trigonometric Functions — CSS In Real Life](https://css-irl.info/radial-gradients-and-css-trigonometric-functions/)
- [A Deep CSS Dive Into Radial And Conic Gradients — Smashing Magazine](https://www.smashingmagazine.com/2022/01/css-radial-conic-gradient/)
- [CSS GPU Animation: Doing It Right — Smashing Magazine](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [How to Create High-Performance CSS Animations — web.dev](https://web.dev/articles/animations-guide)
- [postcss-easing-gradients — npm](https://www.npmjs.com/package/postcss-easing-gradients/v/1.2.0)
- [Inverse Square Law — Wikipedia](https://en.wikipedia.org/wiki/Inverse-square_law)
- [Make a Smooth Shadow, Friend — CSS-Tricks](https://css-tricks.com/make-a-smooth-shadow-friend/)
