# Single-Row Mobile Workflow Bar Execution Plan

## Status and authority

This document is the execution source of truth for converting Rowta's mobile sticky workflow controls from two rows into one row. It was prepared on July 14, 2026 from the published implementation, the supplied iPhone screenshot, and rendered measurements at 390px, 360px, and 320px viewport widths.

This is a planning artifact only. No interface code has been changed while preparing it.

## Desired outcome

On mobile and compact tablet layouts, the persistent controls should read as two related control areas on one horizontal line:

```text
[ selected week | more weeks ]  [ Week | Groceries | Recipes ]
```

The calendar area establishes planning context. The workflow area provides navigation. Week and Groceries remain the two labeled primary destinations. More weeks and Recipes become icon-only controls on mobile so the complete bar fits without reducing touch targets or wrapping.

The result should feel like one calm, intentional toolbar rather than two stacked segmented controls.

## Current rendered baseline

At the current mobile breakpoint:

- the sticky bar is approximately 107px high;
- week selection occupies the first 44px row;
- workflow navigation occupies the second 44px row;
- the remaining height comes from padding and the gap between rows;
- at 390px, the bar has about 346px of usable inner width;
- at 360px, it has about 315px of usable inner width;
- at 320px, it has about 275px of usable inner width;
- the calendar disclosure is already a 44px icon control;
- Week and Groceries are currently flexible labeled controls;
- Recipes currently requires approximately 75-88px because its label remains visible;
- the two rows use unrelated column tracks, which creates the visible alignment problem.

The one-row design is feasible at all supported widths if the calendar and Recipes controls remain exactly 44px, the selected-week status is allowed to compress, and Week/Groceries drop only their decorative icons at the narrowest breakpoint.

## Product decisions

The following decisions are fixed for this pass.

1. At compact widths, the week context and workflow navigation occupy one sticky row.
2. The bar contains two distinct segmented groups separated by a small gutter, not six equal controls in one undifferentiated segment.
3. The left group contains a selected-week status and a 44px calendar disclosure.
4. The right group contains Week, Groceries, and Recipes.
5. Week and Groceries retain visible labels at every supported width.
6. Recipes becomes an icon-only 44px control at mobile widths.
7. More weeks remains an icon-only 44px control at mobile widths.
8. The grocery badge remains visible and must not alter the width of the Groceries control.
9. The complete mobile sticky bar targets 56-60px high and must never exceed 62px in its normal closed state.
10. All interactive controls retain a minimum 44 x 44px target.
11. The selected-week status always reflects the active week; it is not permanently labeled `This week` when another week is selected.
12. The week menu contains every available week on compact layouts, because the separate current-week and next-week tabs are no longer displayed there.
13. Recipe detail keeps its focused one-row variant and does not reintroduce the week picker.
14. The Rowta brand/utility header continues to scroll away.
15. No bottom navigation or scroll-triggered collapsing animation is added.

## Target structure

### Compact toolbar

The conceptual layout is:

```text
┌────────────────────────┐  ┌─────────────────────────────────┐
│ selected week │ calendar│  │ Week │ Groceries │ recipe icon │
└────────────────────────┘  └─────────────────────────────────┘
```

The two groups share:

- the same 44px control height;
- the same border color and radius;
- the same vertical alignment;
- compatible active, hover, and focus treatments.

They remain visually separate through a 5-6px gutter. Do not add a third nested outline or a heavy double divider between the groups.

### Selected-week status

The status area is informational rather than a second menu trigger. It displays:

```text
This week
Jul 12-18
```

or:

```text
Next week
Jul 19-25
```

or, for later weeks:

```text
In 2 weeks
Jul 26-Aug 1
```

Rules:

- the range is the visually stronger line;
- the relative label is smaller and secondary;
- the text truncates safely rather than increasing the row height;
- the status updates immediately after a week is selected;
- at 360px and below, the relative label may be visually hidden and the date range becomes the single visible line;
- the full relative label and range remain available to assistive technology.

The status should use a neutral element such as a `<div>` or `<output>`, not button styling, because the calendar icon is the actual disclosure control.

### More-weeks control

The existing calendar icon remains the disclosure affordance.

Requirements:

- 44 x 44px at compact widths;
- accessible name includes purpose and current selection, for example `Choose week. Currently This week, Jul 12-18`;
- native `<details>/<summary>` expanded semantics remain available;
- open state receives a visible tint and focus ring;
- selected-later-week state is communicated by the adjacent status, not by leaving the calendar icon permanently highlighted;
- the caret and visible `More weeks` label are hidden only at mobile widths;
- tablet and desktop may retain the visible `More weeks` label where room permits.

### Week menu

On compact layouts the menu must list all five available weeks, including This week and Next week.

Each option displays:

- relative label;
- date range;
- selected state.

Behavior:

- selecting a week closes the menu;
- the status area updates;
- focus returns to the calendar disclosure after the rerender;
- Escape closes the menu and returns focus to the summary;
- clicking outside closes the menu;
- the menu is anchored to the left edge of the week-context group or toolbar, not the 44px icon itself;
- width is `min(290px, calc(100vw - 32px))` or an equivalent contained value;
- menu height is capped with internal scrolling if necessary;
- it must not be clipped by the sticky bar or application shell.

### Week and Groceries

These remain the labeled primary workflow controls.

Week:

- calendar-check icon plus `Week` at ordinary phone widths;
- visible `Week` label without the decorative icon at the narrowest breakpoint;
- strong active treatment when the planner is open.

Groceries:

- basket icon plus `Groceries` at ordinary phone widths;
- visible `Groceries` label without the decorative icon at the narrowest breakpoint;
- grocery-count badge remains visible for nonzero counts;
- badge remains capped at `99+`;
- strong active treatment when the shopping list is open.

The two controls remain a joined primary segment with one internal divider.

### Recipes

Recipes becomes a 44px icon-only secondary control on mobile.

Requirements:

- retain the cooking-pot icon;
- retain the regular/fill icon swap for inactive/active states;
- visible label is visually hidden, not removed from the accessible name;
- explicit `aria-label="Recipes"` or `aria-label="Browse recipes"` is present;
- `aria-current="page"` remains present when Recipes or recipe detail is active;
- active state uses a clearly visible tinted background and border because there is no visible text label;
- it remains separated from Groceries by the secondary-control styling, but without the current detached horizontal gap that makes it appear misaligned.

## Responsive sizing contract

### Wide desktop: 981px and above

- Preserve the current one-row desktop composition.
- Keep This week and Next week visible as direct choices.
- Keep the labeled More weeks control.
- Keep Week, Groceries, and Recipes labels visible.
- Do not change desktop ordering or interaction behavior in this pass.

### Compact tablet: 761-980px

- Use one horizontal toolbar rather than the current two-row tablet layout.
- Use the selected-week status plus the labeled More weeks disclosure in the left group.
- Keep Week, Groceries, and Recipes labels visible when they fit.
- If the measured 761px boundary cannot support all labels with 44px targets, switch More weeks to icon-only before allowing wrapping.
- The bar must remain one row throughout this range.

### Mobile: 361-760px

- Use two horizontal group columns inside the toolbar.
- Suggested outer grid:

```css
grid-template-columns: clamp(104px, 36%, 126px) minmax(0, 1fr);
gap: 6px;
```

- Left group: `minmax(0, 1fr) 44px`.
- Right group: flexible Week, flexible Groceries, fixed 44px Recipes.
- More weeks and Recipes are icon-only.
- Week and Groceries retain icon plus label.
- The closed bar remains at or below 60px whenever browser rounding permits.

### Narrow mobile: 320-360px

- Keep the same one-row structure.
- Show only the selected date range visually; retain the relative label for assistive technology.
- Hide the decorative SVG icons inside Week and Groceries, but keep both text labels.
- Keep the calendar and Recipes controls at 44px.
- Position the grocery badge independently so hiding the basket icon does not hide the count.
- Reduce horizontal gaps and padding, not font size below readable levels.
- Do not abbreviate `Groceries` to `Shop` unless separately approved.

### Below 320px

- No new supported breakpoint is introduced.
- Layout must remain contained and avoid horizontal page overflow, but 320px remains the formal minimum validation width.

## Proposed markup changes

Update `index.html` so `.week-context` can support a status region independently of the desktop tabs:

```html
<div class="week-context" aria-label="Week navigation">
  <div class="selected-week-status" aria-live="polite">
    <span id="selectedWeekRelative">This week</span>
    <strong id="selectedWeekRange">Jul 12-18</strong>
  </div>
  <div id="weekTabs" class="week-tabs" ...></div>
  <details class="week-picker">...</details>
</div>
```

Implementation notes:

- `.selected-week-status` is compact-layout content and hidden on wide desktop.
- `.week-tabs` remains the current desktop two-choice control and is hidden in compact mode.
- add stable classes to the visible labels inside Week, Groceries, and Recipes so CSS can hide only the intended label/icon at specific breakpoints;
- do not duplicate navigation buttons for mobile and desktop;
- preserve `data-view-button` and `data-week-key` contracts.

## Rendering and state changes

Update `renderWeekTabs()` in `app.js` to:

1. determine the active week and its index;
2. populate the selected-week relative label and date range;
3. update the calendar summary accessible name;
4. continue rendering This week and Next week into the desktop tabs;
5. render all five weeks into the menu with a class or data attribute identifying the first two primary options;
6. hide the duplicated first two menu options only on wide desktop through CSS;
7. update selected state consistently in tabs, menu, and status;
8. avoid using the calendar control's active tint merely because a later week is selected.

After a menu selection:

- preserve the selected week in the existing state;
- rerender planner, recipes, and groceries as today;
- close the disclosure;
- restore focus to the calendar summary;
- keep the current URL/view unchanged;
- do not reset scroll position unnecessarily.

## Recipe-detail behavior

Recipe detail already uses a focused one-row bar and should remain distinct.

At compact widths:

- keep `Back to recipes` visible;
- keep Week and Groceries labeled;
- make Recipes icon-only;
- do not show selected-week status or calendar disclosure;
- at 320-360px, hide decorative Week/Groceries icons if required;
- keep the bar at approximately 60px high;
- preserve Recipes as the active navigation destination.

Do not combine Back to recipes with the week-context group.

## Visual treatment

- Use one sticky background surface with a restrained bottom shadow.
- Each of the two control groups receives one border and one radius.
- Use internal one-pixel separators rather than separate pill borders for every control.
- Keep the gutter between groups at 5-6px.
- Avoid a literal heavy `||` divider; spacing and group borders should communicate separation.
- Use the existing Rowta color tokens and Phosphor icons.
- Keep inactive controls neutral.
- Week/Groceries active state uses the established sage treatment.
- Recipes active state may use the existing secondary tint, but it must meet contrast requirements and remain clearly active when shown without text.
- The selected-week status should not look pressed or clickable.
- Do not add animation beyond existing color/focus transitions.

## CSS consolidation requirements

The current week bar is affected by multiple generations of base, non-planner, tablet, mobile, and final override rules. Execution must consolidate the touched selectors rather than add another disconnected override block.

Consolidate at minimum:

- `.week-bar`;
- `.week-context`;
- `.week-tabs` and buttons;
- `.week-picker`, summary, and menu;
- `.week-bar .app-nav` and buttons;
- `.workflow-primary`;
- `.workflow-secondary`;
- `.workflow-back`;
- the 761-980px tablet rules;
- the 760px and 360px mobile rules;
- recipe-detail week-bar exceptions.

Remove obsolete rules that force:

- compact tablet navigation into two rows;
- mobile `.week-context` into row 1 and `.app-nav` into row 2;
- a visible Recipes label at mobile widths;
- the selected-later-week state onto the More weeks label in compact mode.

Keep print behavior unchanged: the sticky workflow bar remains hidden when printing.

## Implementation phases

### Phase 1 - Add the selected-week status contract

Files: `index.html`, `app.js`

- Add selected-week relative/range elements.
- Add stable label/icon classes to navigation controls.
- Add element references.
- Extend `renderWeekTabs()` to update the compact status and accessible summary name.
- Render a complete compact week menu while preserving desktop direct week choices.

### Phase 2 - Build the single-row responsive grid

File: `styles.css`

- Replace the compact two-row layout with the two-group one-row grid.
- Set shared 44px control metrics.
- Create the flexible/fixed column behavior described above.
- Remove the detached margin before Recipes in compact mode.
- Reduce the normal compact bar height to 56-60px.

### Phase 3 - Add icon-only responsive states

Files: `index.html`, `styles.css`, `app.js`

- Hide the visible More weeks and Recipes labels at mobile widths.
- Preserve accessible names.
- Preserve active/expanded state.
- At 360px and below, hide only decorative Week/Groceries icons.
- Re-anchor the grocery badge so it survives that icon change.

### Phase 4 - Refine week-menu behavior

Files: `app.js`, `styles.css`

- Include all weeks on compact layouts.
- Anchor and contain the popover.
- Restore focus after selection.
- Verify Escape and outside-click dismissal.
- Ensure selected state is announced and visually clear.

### Phase 5 - Integrate recipe detail and consolidate CSS

Files: `styles.css`, optionally `app.js`

- Apply the icon-only Recipes rule to recipe detail.
- Preserve Back to recipes and the approximately 60px detail bar.
- Remove superseded two-row and duplicated week-bar rules.
- Confirm no change to desktop print behavior or dialogs.

### Phase 6 - Validate and document

Files: `docs/single-row-mobile-workflow-bar-plan.md`

- Run the full route/viewport/state matrix.
- Record measurements, tests, and approved deviations.
- Do not commit, push, or publish unless separately requested.

## Accessibility requirements

- Every control remains at least 44 x 44px.
- Icon-only More weeks and Recipes controls have explicit accessible names.
- Current view retains `aria-current="page"`.
- Week options expose their selected state through the existing active/tab semantics or an equivalent accessible attribute.
- The native details disclosure exposes expanded/collapsed state.
- Selected-week status updates are announced without duplicating every planner rerender.
- Focus returns to the disclosure after choosing a week.
- Escape closes the disclosure and restores focus.
- Focus rings must not be clipped by either segmented group.
- Active states do not rely on color alone: fill icon, background, border, and `aria-current` work together.
- Decorative icons hidden at narrow widths remain `aria-hidden`.
- The grocery badge remains included in the Groceries accessible name.

## Validation matrix

### Viewports

| Viewport | Purpose |
| --- | --- |
| 1440 x 900 | wide desktop preservation |
| 1024 x 768 | desktop boundary |
| 981 x 900 | wide/compact breakpoint |
| 820 x 1180 | compact tablet one-row behavior |
| 761 x 900 | compact-tablet lower boundary |
| 760 x 900 | mobile upper boundary |
| 520 x 900 | large phone |
| 430 x 932 | common large phone |
| 390 x 844 | supplied screenshot class |
| 360 x 800 | narrow fallback boundary |
| 320 x 700 | minimum-width stress test |

### Routes

Verify each relevant viewport on:

- Week;
- Recipes;
- Groceries;
- Catalog;
- recipe detail.

### Week states

Verify:

- This week selected;
- Next week selected;
- each later week selected;
- a range crossing a month boundary;
- the menu closed;
- the menu open;
- selection followed by rerender and focus restoration.

### Grocery badge states

Verify representative counts:

- zero/hidden;
- one digit;
- two digits such as 47;
- capped `99+`.

### Assertions

For compact routes:

- the closed workflow bar is exactly one row;
- bar height is no more than 62px;
- all controls are at least 44px high and icon controls are at least 44px wide;
- selected-week text does not overlap or force wrapping;
- Week and Groceries labels remain visible at 320px;
- Recipes and More weeks visible labels are hidden at mobile widths;
- their accessible names remain present;
- the grocery badge does not collide with text, borders, or the Recipes control;
- the week menu remains inside the viewport;
- the sticky bar remains at `top: 0` after scrolling;
- the Rowta header scrolls out of view;
- no body-level horizontal overflow exists;
- no content or focused element is hidden behind the sticky bar;
- browser Back/Forward and hash routing preserve the correct active state;
- the browser console has no errors.

## Acceptance criteria

Implementation is complete only when all of the following are true.

1. At 760px and below, week context and workflow navigation render on one horizontal row.
2. The normal closed mobile bar measures no more than 62px high.
3. The bar reads as two aligned control groups rather than stacked or disconnected controls.
4. More weeks and Recipes are 44px icon-only controls on mobile.
5. Week and Groceries retain visible labels at 320px.
6. The selected-week status correctly identifies This week, Next week, and every later week.
7. The compact week menu provides access to all available weeks.
8. Selecting a week closes the menu, updates all dependent content, and restores focus.
9. The grocery badge remains visible, aligned, and accessible at all tested counts.
10. Recipes has an unmistakable active state on Recipes and recipe detail despite being icon-only.
11. Recipe detail remains a single compact row with Back to recipes.
12. Wide desktop behavior remains unchanged.
13. Compact tablet behavior no longer wraps into two rows.
14. No target viewport has page-level horizontal overflow or clipped focus indicators.
15. Print, dialogs, planning actions, recipe selection, grocery calculation, routing, and persistence remain functional.

## Expected file changes

### Must change

- `index.html`
- `app.js`
- `styles.css`
- `docs/single-row-mobile-workflow-bar-plan.md` for the execution record

### Must not change

- recipe data or schema;
- recipe images;
- grocery-generation logic;
- planner storage key;
- icon sprite or icon license, unless implementation discovers a genuinely missing icon and scope is approved.

## Explicit non-goals

- Redesigning recipe cards, recipe detail content, or groceries.
- Changing the number of available weeks.
- Adding horizontal swipe gestures.
- Adding a bottom dock.
- Adding an animated collapsing header.
- Replacing the Phosphor icon system.
- Renaming Week or Groceries.
- Abbreviating Groceries to Shop without approval.
- Making the selected-week status a second redundant menu trigger.
- Committing, pushing, or publishing as part of plan creation.

## Execution record — July 14, 2026

Status: implemented and verified locally.

- Replaced the compact two-row workflow controls with one sticky row containing an aligned week-context group and primary workflow group.
- Added a live selected-week status and an accessible compact week menu containing all five available weeks.
- Kept Week and Groceries labeled at phone widths while collapsing More weeks and Recipes to 44px icon controls at 760px and below.
- Preserved the grocery count badge at 320px and kept recipe detail navigation on the same compact row.
- Restored focus to the week picker after a selection and updated its accessible label with the selected week.
- Preserved the existing wide desktop tabs from 981px upward.

Verification completed:

- Responsive measurements at 320, 360, 520, 760, 761, 820, 980, 981, 1024, and 1440px.
- Compact closed-bar height: 59.2px from 320 through 980px, with no page-level horizontal overflow.
- Desktop layout resumed at 981px.
- Later-week selection updated the visible status, closed the menu, and restored focus to its summary control.
- Sticky behavior kept the workflow bar at the top after the brand header scrolled away.
- Recipe, grocery, catalog, and recipe-detail states retained the compact control bar; the recipe-detail row remained 59.2px high.
- Browser console contained no errors.
- `app.js` parsed successfully.
- Recipe validation passed with 36 recipes, 130 stages, and 302 actions.
- `git diff --check` passed; line-ending notices are informational for this Windows worktree.

The changes remain uncommitted and unpublished pending an explicit request.
