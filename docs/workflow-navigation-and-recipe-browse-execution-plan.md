# Workflow Navigation and Recipe Browse Execution Plan

## Status and authority

This document is the source of truth for the next navigation and recipe-browsing refinement. It was prepared on July 14, 2026 after reviewing the published site at mobile and desktop sizes and inspecting the current Week, recipe grid, and recipe list implementations.

No interface code has been changed as part of writing this plan. Execution should proceed phase by phase from the current working tree, preserving unrelated user changes.

## Desired outcome

Rowta should foreground its two recurring jobs:

1. plan the week's dinners;
2. buy the groceries that plan requires.

The brand and utility header should establish identity at the top of the page, then scroll away. The week selector and workflow navigation should become the persistent control surface. Recipe browsing should remain easy to reach, but it should read as a supporting step within planning rather than a third workflow of equal weight.

The Recipes page should borrow the strongest qualities of the Week page: recognizable photography, a clear recipe name, useful ingredient-led descriptive copy, restrained controls, consistent row/card geometry, and an obvious next action.

## Baseline findings

### Sticky behavior

- `.site-header` currently owns `position: sticky; top: 0`, so the Rowta mark, Catalog, and Print remain visible while the user scrolls.
- `.week-bar` is currently static, so the selected dates and Week/Recipes/Groceries controls leave the viewport.
- At a 390 x 844 viewport, the current sticky brand/utility header is about 112px tall and the week/navigation block is about 114px tall. Simply making both sticky would consume too much of the phone viewport.
- At desktop size, the brand header is about 59px tall and the week bar is about 63px tall. The desktop week controls can fit in one compact sticky row.

### Workflow hierarchy

- Week, Recipes, and Groceries are currently rendered as three equal navigation buttons.
- The actual planning path is Week -> choose/add a dinner -> Recipes -> return to Week, with Groceries as the other recurring destination.
- The existing `More weeks` disclosure provides a useful precedent for keeping a secondary option close without giving it equal visual weight.

### Week meal anatomy

- Planned meals already use the desired information hierarchy: image, recipe name, `plannerDescription`, and a restrained management area.
- Desktop planned-meal rows are about 86px high; mobile planned-meal rows are about 76px high.
- The title and description are line-clamped, so rows stay consistent without losing the character of the recipe.

### Recipe browse anatomy

- Grid cards currently emphasize a recommendation reason and a metadata line such as time, protein, and format. They do not show `plannerDescription`.
- At 390px, recipe grid cards are full-width and roughly 318-353px tall. Their information density is low relative to their height.
- The current list is implemented as a table with columns for time, protein, format, rating, last cooked, and action.
- At 390px, list rows are about 152px tall and still expose time, protein, five rating controls, and Add. The recipe poem is absent.
- The desktop list is compact in height, but its seven-column structure reads as a catalog/database rather than a visual dinner shortlist.
- All 36 recipes already have a properly cased `plannerDescription`; no recipe-data migration is required for this work.

## Product decisions

The following decisions should be treated as fixed for this execution pass.

1. The Rowta brand/utility header scrolls with the document on desktop and mobile.
2. The week selector and workflow navigation become sticky at the top of the viewport.
3. Week and Groceries are the two primary workflow destinations.
4. Recipes remains one tap away but is presented as a compact secondary destination.
5. Recipe browsing uses image, recipe name, and `plannerDescription` as its primary content in both grid and list modes.
6. Time, protein, format, difficulty, rating, and last-cooked values are removed from recipe browse cards and rows. The underlying data and recommendation logic remain intact.
7. The Add/Added/Choose action remains visible because recipe browsing serves the planning workflow.
8. Recommended recipes and the full collection use the same core recipe-card content contract.
9. Card-level recommendation-reason pills are removed. The section heading already communicates that the first group is recommended.
10. Grid becomes the initial recipe-browse mode because the redesigned experience is image-led. List remains available as the denser scanning option. Remember the user's chosen mode for later visits on the same device.
11. Recipe detail remains a focused cooking surface. It will use a compact workflow-bar treatment rather than restoring the large brand header or adding a bottom dock.
12. No floating bottom navigation returns.

## Target information architecture

### Brand and utility header

The non-sticky header continues to contain:

- Rowta mark and home link;
- Catalog;
- Print.

It must remain visually polished at the top of the page, but it has no persistent role after the user begins scrolling.

### Sticky workflow bar on desktop

Use a single compact row:

- left group: Week and Groceries as the primary segmented controls;
- adjacent quiet control: Recipes, labeled `Browse recipes` with the cooking-pot icon;
- right group: This week, Next week, and More weeks.

The Recipes control should be smaller/quieter than the two primary destinations, but it must retain a visible label and a 44px minimum target. When Recipes is active, its active state must be unambiguous without making it the same visual weight as Week and Groceries.

### Sticky workflow bar on mobile

Use two compact rows:

- first row: This week, Next week, and the existing More weeks disclosure;
- second row: two equal primary controls for Week and Groceries, plus a compact Recipes disclosure/control.

The secondary control should follow the visual language of More weeks: compact, labeled, keyboard-operable, and not presented as a third equal tab. Opening it reveals a single `Browse recipes` destination. When Recipes is the active view, the compact control itself must show the active state so the current location is never hidden.

The complete sticky block should target approximately 92-100px at 390px wide, rather than stacking the current 112px header above the 114px week bar. Controls may tighten spacing and type at narrow widths, but not below a 44px touch target.

### Planning context while choosing a recipe

When the Recipes page was opened from an empty day or `Choose another` action:

- show a compact context line near the recipe-page heading, such as `Choosing dinner for Monday`;
- change card actions from generic `Add` to `Choose for Monday` where space permits, with an accessible full label everywhere;
- after selection, preserve the current behavior of returning to Week and focus the newly filled day;
- navigating away without choosing must not silently add or move a meal.

When Recipes is opened independently, use the normal Add/Added action.

### Recipe detail

On recipe detail, keep a compact sticky bar with:

- a clear back-to-recipes control;
- Week and Groceries access;
- no expanded week-picker row unless the user opens it.

This avoids occupying cooking space with the full browse/navigation composition while preserving the user's requested persistent access to the core workflow.

## Recipe browse component contract

Create one shared renderer/content contract for recommended cards, collection grid cards, and list rows:

```text
recipe image
recipe name
plannerDescription
planning action
```

Requirements:

- image and title both open recipe detail;
- `plannerDescription` is the only descriptive copy shown on the card/row;
- title and description use predictable line clamps so sibling cards remain aligned;
- the action has stable placement and clear Added/Choose states;
- missing images continue to use the existing recipe placeholder treatment;
- title casing and poem casing come directly from the validated recipe data;
- metadata remains available in recipe detail and in the data model, but not in the browsing surface.

## Grid and recommended-card redesign

### Visual hierarchy

1. Photography is the strongest element.
2. Recipe title is next.
3. The ingredient-led poem provides the deciding context.
4. The planning action is clear but visually restrained until needed.

### Layout

- Desktop: use a responsive multi-column grid with equal-height cards and aligned action areas.
- Tablet: reduce columns based on actual available card width rather than forcing narrow text.
- Mobile: use one full-width card per row with a shorter image ratio and tighter vertical rhythm than the current 318-353px cards.
- Recommended and collection cards share image ratio, padding, title treatment, poem treatment, and button metrics.
- Remove reason pills and `.recipe-meta-line` from rendered cards.
- Clamp titles to two lines and poems to two or three lines, with the same reserved text height across sibling cards.
- Ensure the action does not jump vertically when a title wraps.

## List redesign

Replace the table-like list with a semantic list of compact recipe rows modeled on Week meal entries.

Each row contains:

- a consistent thumbnail;
- a text block with the recipe name and `plannerDescription`;
- a single planning action at the trailing edge.

Behavior and responsive rules:

- The thumbnail and title open recipe detail.
- Desktop rows target approximately 88-96px to leave the poem readable while remaining scannable.
- Mobile rows target approximately 84-100px depending on narrow-width wrapping, with a 72px image as the starting point.
- The poem is clamped to two lines on ordinary phones and one line only at the narrowest supported width if required.
- The action remains at least 44 x 44px and must not cover the title or description.
- Remove table roles, column headers, and browse-row rating controls.
- Preserve recipe rating data and rating controls on recipe detail; this is a presentation change, not feature deletion.

## Recipe page framing

Refine the page around the simplified cards without turning this pass into a full recipe-detail redesign.

- Keep one concise page heading and supporting sentence.
- If the user is choosing for a day, the planning-context line takes priority over generic library statistics.
- Reduce the visual prominence of the Library/Shortlist statistics on mobile; they are informational, not part of choosing dinner.
- Keep Recommended first, followed by the full collection.
- Use the same List/Grid toggle metrics as other segmented controls and expose pressed/selected state accessibly.
- Keep Load more, but align it to the new collection layout.

## Implementation phases

### Phase 1 - Establish the sticky shell

Files: `index.html`, `styles.css`

- Remove sticky positioning and backdrop treatment from `.site-header`.
- Refactor `.week-bar` into a workflow-bar shell that can remain sticky at `top: 0`.
- Give the sticky bar an opaque or near-opaque background, border, and restrained shadow so content never shows through illegibly.
- Ensure the sticky background visually spans the viewport while its contents remain aligned to the application max width.
- Set z-index below dialogs/toasts but above page cards and menus.
- Ensure week and recipe disclosures are not clipped by overflow.
- Add `scroll-margin-top` to relevant section anchors and focused destinations.
- Hide both the brand header and workflow bar in print as appropriate.

### Phase 2 - Recompose workflow navigation

Files: `index.html`, `app.js`, `styles.css`

- Replace the equal three-tab composition with Week/Groceries primary controls and a compact Recipes secondary control.
- Implement the desktop one-row and mobile two-row layouts described above.
- Preserve grocery-count badge behavior on Groceries.
- Preserve selected week, future-week disclosure, URL hash routing, browser history, and active-state rendering.
- Add appropriate `aria-current`, expanded state, accessible names, and focus restoration for the Recipes disclosure.
- Close open disclosures after a destination is selected and on Escape.
- Define the compact recipe-detail variant.

### Phase 3 - Consolidate recipe browse rendering

Files: `app.js`

- Introduce a shared recipe-browse content helper using title, image, and `plannerDescription`.
- Remove browse-card rendering of recommendation reason and metadata.
- Keep recommendation ranking logic unchanged.
- Keep Add/Added and day-picking state logic unchanged, then layer the contextual action label onto it.
- Make Grid the initial mode and persist the user's selected List/Grid mode with a small, versioned preference key.
- Do not change recipe IDs, recipe storage, recipe schema, or grocery generation.

### Phase 4 - Rebuild grid and recommended cards

Files: `styles.css`, `app.js`

- Apply the shared component contract to both recommended and collection cards.
- Standardize image aspect ratio, card padding, title/poem clamps, and action alignment.
- Remove superseded reason-pill and metadata-line CSS.
- Verify equal-height behavior with short and long recipe titles/descriptions.
- Tune the column count and gaps at desktop, tablet, and phone breakpoints.

### Phase 5 - Replace the table list

Files: `app.js`, `styles.css`

- Replace `.recipe-list-table`, headers, cells, and table roles with a semantic recipe list.
- Render thumbnail, title, poem, and one planning action per row.
- Remove list-only time/protein/format/rating/last-cooked presentation.
- Reuse Week-card sizing and text-clamp principles without copying planner-only movement controls.
- Remove superseded table grid-template and responsive nth-child hiding rules.

### Phase 6 - Integrate planning context

Files: `index.html`, `app.js`, `styles.css`

- Render the selected-day context on Recipes when `recipePickDayIndex` is active.
- Use contextual Choose labels and accessible names.
- Verify successful selection returns to Week, focuses the destination, updates Groceries, and clears picker context.
- Verify ordinary Add behavior still works when browsing outside day-pick mode.

### Phase 7 - Consolidation and polish

Files: `styles.css`, `app.js`, `index.html`

- Consolidate duplicate late-file overrides for `.week-bar`, `.app-nav`, recipe cards, and recipe list rows.
- Remove dead selectors and obsolete mobile-bottom-nav assumptions.
- Normalize icon centering, control heights, gaps, borders, and focus rings in all newly touched components.
- Respect reduced-motion preferences and avoid scroll-dependent animation that could make the sticky bar unstable.
- Update this document with an execution record, test results, and any approved deviations.

## Accessibility requirements

- All interactive targets are at least 44 x 44px on touch layouts.
- Active view and active week are conveyed without relying on color alone.
- The Recipes secondary control has a visible label; do not reduce it to an unexplained icon.
- Disclosures expose `aria-expanded` through native `<details>` behavior or an equivalent accessible implementation.
- Keyboard users can open, navigate, select, and dismiss the secondary menu.
- Focus is restored predictably after closing a disclosure or selecting a recipe.
- Image buttons have recipe-specific accessible names; decorative image `alt` remains empty when the adjacent text supplies the name.
- List/Grid state is conveyed with `aria-pressed` or the appropriate tab pattern.
- Sticky content must not obscure focused elements, headings, toasts, or dialogs.

## Responsive and regression validation

Test at minimum:

| Viewport | Purpose |
| --- | --- |
| 1440 x 900 | wide desktop navigation, grid columns, compact list |
| 1024 x 768 | smaller desktop/tablet transition |
| 820 x 1180 | tablet composition and disclosures |
| 760 x 900 | exact mobile breakpoint behavior |
| 520 x 900 | large phone |
| 390 x 844 | representative phone |
| 320 x 700 | narrow-phone stress test |

For every relevant width, verify:

- the Rowta header scrolls fully out of view;
- the workflow bar reaches and remains at `top: 0`;
- sticky content does not cover the first visible card or focused control;
- Week and Groceries are visually primary;
- Recipes is visible, understandable, one tap away, and visibly active when selected;
- week and recipe disclosures open above content without clipping;
- Grid and List both show image, title, poem, and action with no browse metadata;
- cards and rows have consistent heights within their layout;
- no body-level horizontal overflow exists;
- recipe selection for each day returns to the correct Week slot;
- groceries recalculate after adding/removing recipes;
- browser Back/Forward preserves view state;
- recipe detail, Catalog, Print, dialogs, toasts, and existing meal movement still work;
- keyboard navigation and focus rings are intact;
- the console has no errors.

Run the existing recipe validator and any existing route/viewport checks after implementation. Add targeted DOM assertions for sticky ownership, recipe browse content, removed metadata, and navigation hierarchy.

## Acceptance criteria

The work is complete only when all of the following are true:

1. Rowta/Catalog/Print scroll away on desktop and mobile.
2. The week selector and workflow navigation remain fixed at the top while scrolling Week, Recipes, and Groceries.
3. Week and Groceries are the only equal-weight primary destinations.
4. Recipes is one tap away through a compact secondary control and its active state is always visible.
5. The phone sticky bar is materially shorter than the current combined brand-header/week-bar stack and does not dominate the viewport.
6. Recommended cards and collection grid cards show image, name, `plannerDescription`, and planning action only.
7. Recipe list rows show image, name, `plannerDescription`, and planning action only.
8. Time, protein, format, difficulty, rating, and last-cooked information no longer appears in recipe browse cards or rows.
9. Recipe detail retains its existing richer information and rating capability.
10. Choosing a recipe for a specific day keeps that context visible and completes the round trip back to the correct Week slot.
11. No bottom floating navigation or standalone grocery CTA is reintroduced.
12. All target viewports pass overflow, sticky-position, accessibility, focus, routing, console, and content checks.

## Expected file changes

### Must change

- `index.html`
- `app.js`
- `styles.css`
- `docs/workflow-navigation-and-recipe-browse-execution-plan.md` (execution record)

### Not expected to change

- `data/recipes.js`
- `data/recipe.schema.json`
- recipe images
- grocery-generation data or algorithms

If implementation reveals that a data/schema change is necessary, stop and document the reason before expanding scope.

## Explicit non-goals

- Rewriting recipe instructions or recipe-detail content.
- Removing metadata from the recipe data model.
- Changing recommendation scoring.
- Changing grocery aggregation or pantry behavior.
- Adding recipe search, filters, categories, or new fields.
- Redesigning Catalog or Print beyond preventing sticky-shell regressions.
- Adding a bottom dock, swipe navigation, touch drag-and-drop, or scroll-triggered header animation.
- Publishing, committing, or pushing until separately requested after implementation and verification.

## Execution record - July 14, 2026

### Completed implementation

- Made the Rowta brand/utility header part of normal document flow.
- Made the week/workflow bar sticky at the top of the viewport.
- Reordered and restyled navigation so Week and Groceries form the primary pair and Recipes is a smaller secondary control.
- Added a compact sticky recipe-detail variant with Back to recipes plus Week, Groceries, and Recipes access.
- Added active-view `aria-current` state to the workflow navigation.
- Changed the first-time recipe view to Grid and added a versioned local preference for List/Grid selection.
- Added an accessible `aria-pressed` state to the List/Grid toggle.
- Added the choose-for-day context line and contextual Choose actions.
- Restored focus to the planned meal after a day-specific recipe selection.
- Rebuilt recommended and collection grid cards around image, title, `plannerDescription`, and the planning action.
- Removed recommendation reason pills and time/protein/format metadata from card rendering.
- Replaced the recipe results table with a semantic list of image/title/poem/action rows.
- Removed browse-row time, protein, format, rating, and last-cooked rendering without changing the underlying data or recipe-detail rating controls.
- Removed superseded recipe table, metadata-line, and recommendation-pill CSS.
- Added final narrow-width containment and print exclusions for the new sticky shell.

### Approved-plan interpretation

The Recipes destination was implemented as a compact direct control rather than a disclosure containing a single menu item. This preserves the requested secondary visual weight while also satisfying the one-tap access requirement and avoiding a redundant two-tap menu with only one destination. It remains visibly labeled and shows a distinct active state.

### Verification results

- JavaScript parsed successfully through the available JavaScript runtime.
- Recipe validator passed: 36 recipes, 130 stages, and 302 actions.
- Responsive matrix passed 35 route/viewport combinations:
  - Week, Recipes, Groceries, and Catalog at 1440, 1024, 820, 760, 520, 390, and 320px widths;
  - recipe detail at the same seven widths.
- All matrix routes reported the expected active view, a static brand header, a sticky workflow bar, 44px navigation controls, and no page-level horizontal overflow.
- Mobile sticky behavior was verified after scrolling: the brand header left the viewport and the workflow bar remained at `top: 0`.
- Day-specific selection was verified from an empty Sunday and Saturday: the correct context and accessible Choose labels appeared, the selected recipe returned to the correct day, groceries recalculated, and focus moved to the new planned-meal action.
- Browser Back/Forward behavior and navigation active states were verified between Week and Recipes.
- Grid and List were visually reviewed at phone and desktop sizes.
- The mobile list was stress-tested at 320px; image, copy, and action columns remained separated with no overlap.
- Browser console check returned no warnings or errors.
- `git diff --check` passed after the final edits.
