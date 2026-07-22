# Typography Readability Design

**Date:** 2026-07-22  
**Status:** Approved design direction  
**Selected approach:** Balanced readability pass

## Context

The workshop site uses a strong visual hierarchy, dark technical styling, and a mix of Manrope, Space Grotesk, and DM Mono. A visual and computed-style audit found that several pieces of core information are styled like tertiary metadata. The main causes are small type, regular weight, wide letter spacing, and the perceived scale difference between large section headings and their supporting copy.

Measured color contrast is generally sufficient: the current light-section slate text is approximately 4.9:1 on the paper background, dark-section supporting text is approximately 8.1:1, and the Hero metadata is approximately 11:1 after alpha compositing. Therefore, the design should improve size, weight, font role, and hierarchy first, with restrained color changes rather than simply making all text white or bold.

## Goals

- Make dates, times, locations, section leads, schedule details, submission instructions, and important dates easy to scan.
- Preserve the current futuristic academic visual identity.
- Keep the existing content, section order, grids, and primary heading scale unchanged.
- Avoid isolated one-word line breaks and horizontal overflow at desktop, tablet, and mobile widths.
- Use a consistent hierarchy instead of applying one global font-size increase.

## Non-goals

- No wording, schedule data, speaker data, organizer data, or link changes.
- No redesign of the Hero, schedule table, person cards, CFP cards, or footer layout.
- No changes to the IROS logo placement or image sizing.
- No blanket conversion of all supporting text to bold or pure white.

## Typography hierarchy

The site will use four functional text levels:

1. **Section leads:** 18–20px, weight 500, approximately 1.6 line-height. These sentences explain the purpose of each major section.
2. **Primary content:** 15–16px, weight 400–500. This includes paragraph copy, talk titles, topic bullets, and submission instructions.
3. **Operational metadata:** 13–14.5px, weight 500. This includes workshop date/time/location, schedule times, navigation, institutions, and important dates.
4. **Decorative labels:** 10–12px, typically uppercase and monospaced. Section indices, eyebrow labels, and small category markers can remain compact because they do not carry core meaning.

## Color roles

Add two readable secondary-text tokens without changing the existing accent palette:

- Light sections: `#465b68`, approximately 6.5:1 against `#f3f6f4`.
- Dark sections: `#c3d0d6`, approximately 11.5:1 against `#0a1626`.

The dark-section token should remain visibly secondary to white headings. Cyan and orange remain reserved for accents, times, icons, status, and the Scaling/Structure identity.

## Component changes

### Header and Hero

- Increase navigation links from about 11.8px to 12.8–13px and raise their resting opacity modestly.
- Increase button labels from about 11.5px to approximately 12.5px while retaining DM Mono and uppercase styling.
- Increase Hero date, time, and location from 11.7px to approximately 14.4px, use weight 500 and a 1.5 line-height, and slightly brighten the text.
- Retain DM Mono for Hero metadata because the strings are short and the typeface reinforces the technical identity.

### Section leads and Introduction

- Change `.section-description` to a responsive 18–20px size, weight 500, and approximately 1.6 line-height.
- Use the new readable light or dark secondary color according to section background.
- Keep the current maximum width and balanced wrapping so the lead remains a compact two-line statement where needed.
- Increase Introduction passage body copy from about 15.4px to 16px and use the readable light-section color.
- Keep passage headings, editorial labels, and the highlighted conclusion structure unchanged.

### Schedule

- Increase schedule metadata from about 10.6px to 12.5px and weight 500.
- Increase table headers from about 10.2px to 12.5px, weight 600, and slightly reduce letter spacing.
- Increase times from about 12.2px to 14px and weight 500.
- Keep speaker/session names at 16px and weight 500.
- Increase talk titles from about 13.8px to 16px, weight 500, and use the readable dark-section color.
- Increase Tentative/Pending badges from about 9px to 10.5–11px and weight 500, retaining their current colors and pill treatment.
- Keep the current column proportions and row padding unless responsive verification shows a real overflow. Long titles may wrap naturally to two lines.
- On mobile, retain the card transformation. Times, names, titles, and statuses use the same minimum readable sizes as desktop.

### Speakers and Organizers

- Increase institution text from about 12.2px to approximately 13.8px, weight 500, and use the readable light-section color.
- Keep names, portrait geometry, row/column spacing, and card layouts unchanged.

### Call for Papers

- Increase topic bullets from about 14.7px to approximately 15.2px, without changing card height unless content requires it.
- Increase the two submission-detail paragraphs from about 13.3px to approximately 15.2px, weight 500, and approximately 1.55 line-height.
- Keep submission labels compact but raise them to approximately 11px and weight 600.
- Increase the awards sponsor paragraph from about 13.1px to approximately 14.4px.
- Increase award secondary counts from about 11px to approximately 12.5px.
- Increase Important Dates labels to approximately 14px and date values to approximately 13.6px, both at weight 500.
- Preserve the equal-width Awards and Important Dates layout.

### Footer

- Increase footer date, time, location, and back-to-top text from about 9.9px to 11.5–12px and raise its opacity modestly.
- Keep the footer kicker and decorative grid treatment unchanged.

## Responsive behavior

- At 1440px, section leads should remain visually subordinate to headings but clearly stronger than ordinary body copy.
- At 768px, the schedule remains readable before and after the table-to-card breakpoint, with no clipped titles or status pills.
- At 390px, Hero metadata remains one item per row, long talk titles and important dates wrap naturally, and no text causes horizontal scrolling.
- Decorative labels may remain small at all breakpoints; operational and primary content must not be reduced below the sizes defined above.

## Validation

- Extend the existing CSS regression test to assert the approved font sizes and weights for Hero metadata, section leads, schedule headers/times/titles/statuses, submission copy, person affiliations, important dates, and footer metadata.
- Run `npm test`, `npm run lint`, and `npm run build`.
- Inspect the production build at 1440px, 768px, and 390px.
- Verify there is no horizontal overflow, no new isolated one-word lines where avoidable, and no loss of visual hierarchy.
- Confirm keyboard focus styling and reduced-motion behavior remain unchanged.

## Acceptance criteria

- The three Hero workshop details are readable at a glance without zooming.
- Section leads read as meaningful editorial introductions rather than captions.
- Schedule headers, times, talk titles, and statuses are comfortably readable while speaker names remain the strongest row content.
- Submission requirements, presentation format, awards, and important dates are readable without leaning in or zooming.
- Speaker and organizer affiliations are readable but remain secondary to names.
- The visual identity, content, responsive layouts, and deployed asset paths remain intact.
