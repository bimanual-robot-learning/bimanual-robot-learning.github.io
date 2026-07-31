# Workshop Important Dates Timeline — Design Specification

## Purpose

Create a publication-ready vertical timeline image for the Workshop promotional
article. The visual must make the four important dates easy to scan on a mobile
screen while matching the established visual language of the Workshop website.

## Deliverables

- A 1080 × 1440 px PNG image for use in a WeChat public-account article.
- An editable SVG source with the same composition.
- A browser-renderable HTML preview used only for visual verification.
- New files only; existing Workshop website and promotional Markdown files must
  not be overwritten.

## Content

The timeline contains exactly four milestones in chronological order:

1. Paper submission deadline — August 24, 2026, 11:59 PM AOE.
2. Acceptance notification — September 6, 2026, 11:59 PM AOE.
3. Camera-ready deadline — September 20, 2026, 11:59 PM AOE.
4. Workshop — September 27, 2026, Pittsburgh.

Primary labels are Chinese, with short English month abbreviations and Workshop
identity used as supporting typography. The footer states that all paper
deadlines are at 11:59 PM AOE and includes the Workshop website address.

## Composition

- Canvas: portrait 1080 × 1440 px with generous safe margins.
- Header: compact `BRL / IROS 2026` identity, a Chinese title, and a short English
  eyebrow.
- Timeline: one vertical central spine with four evenly paced milestone nodes.
- Milestone cards alternate around the spine while maintaining a clear top-to-
  bottom reading order.
- The first node highlights the actionable submission deadline in orange.
- The two intermediate nodes use cyan accents.
- The final Workshop node uses a cyan-to-orange treatment and includes
  `Pittsburgh` as a location badge.
- Footer: AOE note and `bimanual-robot-learning.github.io`.

## Visual Language

The design follows the Workshop website tokens and motifs:

- Deep navy base: `#07101d`.
- Cyan accent: `#52d8e6`.
- Orange accent: `#ff7d4f`.
- Light text: white and the website's readable light-slate family.
- A subtle 64 px technical grid over the dark background.
- Light cyan/orange glows used sparingly around focal milestones.
- Restrained 5–8 px corner radii, thin translucent borders, and minimal shadow.
- Display typography inspired by Space Grotesk; date/time details use a DM Mono-
  style monospaced face, with system fallbacks for reliable rendering.

## Readability Requirements

- Every date, event label, time, and location remains legible at common mobile
  article widths.
- The chronological order is understandable without relying on color.
- Chinese labels are the primary reading layer; English abbreviations are
  secondary.
- No essential text is placed near canvas edges or over low-contrast glow.
- The visual contains no interaction, animation, or hidden content.

## Verification

- Confirm the exported bitmap is exactly 1080 × 1440 px.
- Confirm all four milestones and their exact dates are present.
- Confirm the first three deadlines show `11:59 PM AOE`.
- Confirm the final milestone shows `Pittsburgh`.
- Render the SVG/HTML in a browser and visually inspect the full canvas for
  clipping, overlap, contrast, spacing, and alignment.
- Confirm no existing promotional or website files were modified.
