# Responsive Visual Refinement Execution Plan

## Status and authority

This document is the source of truth for the July 2026 surface-system refinement. It supersedes earlier broad visual-treatment guidance while preserving completed functional decisions for navigation, meal movement, recipe browsing, ingredient access, recipe stages, grocery generation, persistence, and print.

## Outcome

Rowta should feel like a focused mobile and desktop product rather than a stack of nested panels. Hierarchy should come primarily from typography, spacing, alignment, imagery, dividers, and state—not from placing every region inside a rounded bordered container.

## Non-negotiable rules

1. Design narrow and wide behavior together for every component.
2. Preserve the established narrow/desktop intent boundary at 760/761px unless rendered evidence requires moving the whole related behavior together.
3. Use CSS layout, not JavaScript viewport detection.
4. Keep 44px touch targets and visible keyboard focus.
5. Preserve all existing planner, recipe, grocery, catalog, persistence, dialog, and print behavior.
6. Keep the single-row compact workflow bar and the focused recipe-detail variant.
7. Cards are reserved for independently selectable content, menus, and dialogs.
8. Repeated information uses alignment and hairline dividers rather than individual card outlines.
9. Shadows are reserved for sticky or floating layers.
10. No page-level horizontal overflow is permitted at 320px or wider.

## Surface vocabulary

- **Canvas:** the page background and ordinary content flow.
- **Section:** an unboxed region separated with spacing, heading hierarchy, or a rule.
- **Interactive object:** a selectable recipe, menu, dialog, or genuinely discrete item.
- **Elevated surface:** the sticky workflow bar, open menu, sheet, or modal.
- **State treatment:** selected, current, recommended, empty, or completed; color must communicate a real state.

Nested surfaces should not exceed two visually apparent levels.

## Responsive contract

### Narrow, up to 760px

- One-column document flow.
- Compact sticky workflow bar no taller than 62px in its closed state.
- Flat planner and grocery rows.
- Full-width or near-full-width recipe imagery.
- Bottom sheets for touch-first secondary actions.
- Catalog data becomes compact labeled rows rather than a wide scrolling table.

### Intermediate, 761px to 980px

- Preserve readable single-column content where a second column would be cramped.
- Use two recipe columns.
- Keep the compact week-context treatment where already implemented.
- Allow supporting content to move below the primary task.

### Wide, 981px and above

- Use deliberate multi-column composition where it improves scanning.
- Week may pair its agenda with a delivery summary.
- Recipe grids use three columns.
- Recipe detail preserves the established 920px reading axis below its hero.
- Catalog uses a full aligned table.

## Execution sequence

1. Establish semantic surface, spacing, radius, shadow, and typography tokens.
2. Flatten page introductions and simplify the global shell.
3. Convert Week to a divider-led agenda while preserving every movement path.
4. Convert Groceries to delivery sections with flat category and item rows.
5. Remove outer wrappers from recipe recommendations and catalog results while retaining recipe cards.
6. Flatten recipe-detail framing without changing ingredient or stage behavior.
7. Adapt Catalog into narrow labeled rows and a wide table.
8. Remove superseded declarations and validate the full viewport and interaction matrix.

## Required viewport matrix

- 1440 x 900
- 1280 x 800
- 1024 x 768
- 820 x 1180
- 761 x 900
- 760 x 900
- 520 x 900
- 390 x 844
- 360 x 800
- 320 x 700

## Acceptance criteria

- Page introductions are not cards.
- Week and Groceries do not place ordinary repeated rows in individual raised cards.
- Recipe cards remain visually discrete, but their section wrappers do not compete with them.
- Recipe method content is the dominant reading path.
- Mobile Catalog does not require horizontal page scrolling.
- Desktop layouts use width intentionally without excessive line lengths.
- Sticky controls never obscure the current task or focused content.
- Every required viewport has no page-level horizontal overflow.
- Keyboard, touch, meal movement, recipe selection, grocery state, ingredient access, dialogs, persistence, console, validation, and print contracts continue to pass.

## Annotated planner refinement — July 14, 2026

### Research synthesis

- Apple recommends differentiating controls from content and using alignment to communicate hierarchy; the planner should therefore keep one distinct control layer and let the schedule read as content rather than another titled container. See [Apple layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout).
- Apple treats tabs as stable top-level navigation and recommends fewer, consistently available destinations. Week and Groceries remain visible while week selection stays adjacent as context. See [Apple tab-bar guidance](https://developer.apple.com/design/human-interface-guidelines/tab-bars).
- Carbon's layering model assigns color by role and level rather than giving every group an independent surface. The workflow bar becomes the only raised control layer; its internal groups use spacing and a divider. See [Carbon color usage](https://carbondesignsystem.com/elements/color/usage/).
- Atlassian reserves shadows for raised and overlay surfaces and recommends whitespace or borders for other distinctions. The workflow bar keeps only a subtle scroll-edge shadow; its nested borders and shadows are removed. See [Atlassian elevation guidance](https://atlassian.design/foundations/elevation/).
- W3C requires contrast against the actual background behind text. The ambient gradient remains pale and decorative, with dark text evaluated against its lightest nearby colors. See [WCAG contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum).

### Fixed decisions

1. Delete the complete `Weekly agenda / Dinners by day` heading block.
2. Let the first day-row rule provide the transition from summary to schedule.
3. Keep `This week / Dinner plan` because it establishes page and time context.
4. Convert the sticky week/navigation area into one translucent control band with no rounded outer container.
5. Remove borders and backgrounds around the week-context and app-navigation groups.
6. Use one vertical divider to separate week context from workflow navigation.
7. Give only the active destination a filled state; inactive navigation sits directly on the band.
8. Preserve the 44px targets, grocery badge, week menu, sticky behavior, and recipe-detail variant.
9. Add an asymmetric apricot-and-sage ambient field that is strongest near the top and fades into the neutral page background.
10. Do not use the gradient to convey state or place low-contrast text over a dark color stop.

### Responsive intent

- **760px and below:** the band spans the content width edge-to-edge, contains two visually separated functional regions, and remains no taller than 62px.
- **761–980px:** the same band and active-only treatment remain; labels and direct week context retain their available space.
- **981px and above:** workflow navigation stays left and direct week selection stays right, but both appear on one undivided band rather than inside separate capsules.

### Acceptance criteria

- No visible `Weekly agenda` or `Dinners by day` text remains.
- There is no rounded outer workflow-bar border and no outlined container around either internal control group.
- The active destination remains immediately recognizable without depending on border nesting.
- The ambient color field is visible but all page text retains WCAG AA contrast.
- The first meal enters the mobile viewport earlier than in the annotated baseline.
- Week selection, Week/Groceries navigation, the grocery badge, recipe-detail back behavior, sticky behavior, and keyboard focus continue to work.
- No page-level overflow appears from 320px through 1440px.

## Implementation record

Status: implemented and verified locally on July 14, 2026.

### Implemented

- Replaced the decorative multi-gradient canvas with a restrained asymmetric apricot-and-sage ambient field that fades into a neutral reading surface.
- Converted every page introduction from a raised card into a typographic heading region with a rule and inline statistics.
- Flattened the Week agenda into aligned, divider-separated day rows while preserving desktop direct actions and mobile meal sheets.
- Kept the delivery summary as the Week page's one supporting card.
- Converted grocery deliveries into flat sections with meaningful accent rules, category bands, and divider-separated item rows.
- Used two delivery columns on wide desktop and one column below 981px.
- Removed outer panels from recipe recommendations and the full collection while retaining recipe cards as selectable objects.
- Added a touch-friendly horizontal recommendation rail at narrow widths and retained the three-column wide grid.
- Removed the duplicate in-page recipe back control; the focused workflow bar now carries the correct return label.
- Flattened recipe hero, ingredient, method, stage-heading, and family-flex framing while preserving the established responsive ingredient and stage behavior.
- Converted the narrow Catalog table into labeled ingredient rows using the same semantic table and added data labels for the adaptive presentation.
- Removed the obsolete Catalog swipe instruction.

### Rendered verification

- PASS: 1440, 1024, 820, 761, 760, 520, 390, 360, and 320px viewport checks showed no page-level horizontal overflow.
- PASS: recipe detail uses the wide grid above the intent boundary and the stacked hero at 760px and below.
- PASS: the compact workflow bar measured 59px across narrow checks, below the 62px ceiling.
- PASS: Week, Groceries, Recipes, Recipe Detail, and Catalog were visually inspected at mobile size.
- PASS: Week, Groceries, Recipes, and Recipe Detail were visually inspected at desktop size.
- PASS: mobile Catalog hides the wide header and displays ingredient, section, recipe count, and typical need without horizontal scrolling.
- PASS: the programmatically focused recipe heading no longer draws a misleading interactive outline.
- PASS: browser console review returned no warnings or errors.

### Interaction and state checks

- PASS: Need changed to Have and returned to Need.
- PASS: recipe Add/Remove state updated and the test additions were removed, restoring the original 47-item grocery badge.
- PASS: the mobile meal action sheet opened for the selected dinner and closed normally.
- PASS: focused recipe navigation retained the correct Back to recipes label and hid the duplicate inner control.

### Static checks

- PASS: `git diff --check` completed without whitespace errors; Git reported only existing line-ending notices.
- PASS: CSS opening and closing brace counts match.
- PASS: the modified application loaded and executed in the local browser with no parse or runtime errors.
- MANUAL: native browser print preview remains outside the browser-control surface; existing print rules were not structurally changed by this pass.

### Annotated planner refinement verification

- PASS: removed the complete `Weekly agenda / Dinners by day` block; neither label remains in the rendered planner.
- PASS: the workflow bar has no rounded outer border, stays 62px tall, and uses active-only fills instead of nested outlined groups.
- PASS: the first dinner enters the 446 x 626 mobile viewport at approximately 328px, materially earlier than the annotated baseline.
- PASS: 1440, 1024, 820, 761, 760, 520, 446, 390, 360, and 320px planner checks showed no page-level horizontal overflow.
- PASS: Week and Groceries navigation, the 47-item badge, and the alternate-week menu all worked at mobile size.
- PASS: the updated planner and grocery views were visually inspected at mobile size, and the planner was visually inspected at desktop size.
- PASS: browser console review returned no warnings or errors after navigation and picker interaction checks.

### Workflow label simplification

- The selected date is presented as compact context rather than a third destination.
- The whole `This week / date range` label opens the week menu, with a small caret as the only affordance.
- Direct week-choice tabs are removed from the bar at all widths; the menu remains the single selection mechanism.
- The primary workflow destination is labeled `Dinners`, paired with `Groceries`.
- PASS: the compact selector, 62px bar height, and zero page overflow were verified from 320px through 1440px.
- PASS: selecting another week updated the label and grocery badge, and returning to the current week restored the 47-item state.

### Summer personality and annotated content refinement

- Adopted Bricolage Grotesque as the shared interface and display family, with Trebuchet MS and system sans-serif fallbacks. The variable family supplies the existing 400-800 weight range without introducing a second typeface.
- Increased the top-left apricot field and added a restrained golden highlight while keeping the reading surface light and the green field secondary.
- Replaced pale selected states with a brighter leaf-green and dark green text so active controls feel energetic without sacrificing contrast.
- Removed the grocery section-filter toolbar; the list already has persistent section headings and does not need a second navigation layer.
- Reworked grocery rows into copy/action and copy/price alignment. Prices finish on the final description baseline; the compact `Remove` action changes to `Restore`, the price changes to `Removed`, and the complete row fades.
- Restored the repository's bordered, rounded Family flexibility card and enriched it with a warm lemon-apricot-to-sage field.
- Restored visible stage bands as apricot-to-sage gradient ribbons with an orange edge, retaining the numbered green marker.
- PASS: the font loaded, the grocery controls were absent, removal and restoration preserved the 47-item baseline, and Grocery/Recipe Detail showed no page overflow from 320px through the available 1280px browser maximum.

### Header and anchor-bar refinement

- Desktop now follows the mobile sequence: selected date context, then Dinners and Groceries.
- The desktop anchor bar is a rounded floating dock with an 11px control inset; the mobile version remains edge-to-edge with square edges.
- The site header uses a translucent warm wash so the apricot background field continues through it instead of stopping at a mismatched solid band.
- The options menu sits in a higher stacking layer than the sticky anchor bar and uses a 220px single-column grid with full-width 46px option rows.
- The Dinner plan introduction no longer draws a bottom border.
- Fixed a stale `filtered` reference left by the grocery-filter removal so direct recipe routes and full initialization complete normally.

### Anchor-tab spacing and state refinement

- The anchor bar now uses three desktop columns: date context, flexible breathing room, and right-aligned navigation.
- Dinners and Groceries use equal 132px desktop widths and equal fractional widths on compact screens, with an explicit 6-8px gap.
- Active navigation no longer receives a filled green surface. A four-pixel lime underline carries selected state throughout the anchor bar.
- The week picker and recipe back action use the same underline language.
- The recipe back action is now a borderless arrow-and-label control rather than an unrelated white button.
- The visible grocery-count badge is suppressed; the dynamic count remains in the button's accessible name.
- PASS: 982px desktop rendered with 11px left/right bar insets, 670px compact navigation used equal 194px tabs, and 447px recipe navigation used equal 125px tabs without page overflow.
