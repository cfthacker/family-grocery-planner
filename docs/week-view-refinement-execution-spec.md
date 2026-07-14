# Week View Refinement and Icon System Execution Specification

## Status and authority

This document is the execution source of truth for the next Week-view refinement pass. It converts the approved product direction into deterministic implementation instructions. The executor must not substitute a different interaction pattern, icon library, breakpoint, visual treatment, or data behavior without explicit user approval.

The working tree already contains uncommitted Week-view and broader visual-system changes in `app.js`, `index.html`, and `styles.css`. Those changes belong to the user. Preserve them and edit forward from the current state. Do not reset, discard, or reconstruct the files from `HEAD`.

This specification was written against the application state on July 13, 2026 in:

```text
D:\Projects\family-grocery-planner
```

## Final outcome

The completed Week view must feel like a seven-day dinner itinerary rather than a compact database table.

On desktop:

- all seven days remain visible;
- planned dinners have larger photography and a clearer visual hierarchy;
- the recipe image and title open the recipe;
- each planned dinner has visible Earlier, Later, and More controls;
- drag-and-drop remains available from the drag handle only;
- keyboard and menu users can perform every movement without dragging;
- moving onto an occupied day swaps the two meals;
- moving onto an empty day moves the meal and leaves the source day empty;
- each move can be undone for six seconds.

On mobile:

- the standalone floating grocery call-to-action is removed;
- the Groceries tab carries the remaining-to-buy count as a compact badge;
- the bottom navigation reads as a distinct floating functional layer above the content;
- recipe imagery is large enough to identify the dish;
- tapping the image or title opens the recipe directly;
- a visible More button opens the dinner action sheet;
- Earlier and Later are the first actions in the sheet;
- Choose another day remains available;
- there is no drag handle and no invisible full-card action overlay.

Across the Week page and global shell:

- Phosphor Icons is the only interface icon family;
- functional controls use regular icons;
- active navigation uses fill icons;
- playful food and section accents use duotone icons;
- labels remain present for navigation and unfamiliar actions;
- platform emoji and one-off CSS-drawn icons are not used.

## Product decisions that are already final

The executor must treat all of the following as decided:

1. Keep current week and next week as the two primary week choices.
2. Keep `Choose another week` as the quiet path to the later three weeks.
3. Keep all seven calendar days visible.
4. Retain desktop drag-and-drop, but make it secondary.
5. Do not expose drag-and-drop on touch layouts.
6. Remove the separate mobile `# items to buy` floating button.
7. Show the remaining-to-buy count on the Groceries tab instead.
8. Redesign planned meals as agenda entries with stronger photography and clearer actions.
9. Use explicit Earlier and Later movement commands.
10. Preserve full-day selection through `Choose another day`.
11. Use Phosphor Icons, pinned locally, instead of CSS-drawn icons, system emoji, Lucide, Material Symbols, OpenMoji, or a mixed icon set.
12. Use a restrained two-tier icon language: regular/fill for functions and duotone for food personality.
13. Do not add more glass surfaces. The floating mobile navigation is the special glass navigation layer.
14. Do not change recipe content, grocery-generation behavior, pantry-staple rules, recipe IDs, or the persisted planner storage key.

## Scope

### In scope

- Mobile grocery badge.
- Mobile floating-navigation separation.
- Planned-dinner card markup and styling.
- Empty-day presentation.
- Desktop drag-handle behavior.
- Earlier, Later, and Choose another day movement.
- Swap behavior and movement feedback.
- Six-second Undo for meal movement.
- Dinner action dialog cleanup.
- Keyboard, focus, and screen-reader behavior for planner actions.
- Week-page and global-shell icon migration.
- A locally vendored SVG sprite and Phosphor license notice.
- Consolidation of affected duplicate CSS rules.
- Desktop, mobile, narrow-mobile, print, persistence, and console validation.

### Out of scope

- Recipe-detail layout changes.
- Recipe editorial changes.
- Grocery-generation algorithm changes.
- Adding more planning weeks.
- Hiding weekends.
- Replacing the current week selector.
- Adding swipe gestures.
- Adding touch drag-and-drop.
- Adding haptic feedback.
- Adding new recipe-category fields.
- Inferring food-category icons from recipe titles.
- Adding an icon to every line of text.
- Replacing the Rowta logo or mark.
- General administration features.
- Committing or pushing the result unless the user separately requests it.

## Files that must change

### Existing files

- `index.html`
  - Replace CSS-drawn icon markup with SVG sprite references.
  - Add the Groceries badge.
  - Remove the standalone mobile grocery CTA.
  - Replace the custom action-sheet wrapper with a native dialog.
  - Add the planner Undo toast.
- `app.js`
  - Add the icon rendering helper.
  - Render the grocery badge.
  - Render the redesigned planned-meal card.
  - Add Earlier/Later movement.
  - Add the undo snapshot and toast behavior.
  - Refactor drag to originate from the handle only.
  - Refactor the meal action sheet to use the native dialog.
  - Restore focus after movement and rerendering.
- `styles.css`
  - Add icon tokens and sprite styling.
  - Refine mobile navigation material and badge styling.
  - Replace the planned-meal card layout.
  - Style movement controls, native dialog, and Undo toast.
  - Remove superseded CSS-drawn icons and duplicate planner overrides.
  - Preserve print and reduced-motion behavior.

### New files

- `assets/rowta-icons.svg`
  - Local SVG symbol sprite containing only the required icons.
- `assets/PHOSPHOR-LICENSE.txt`
  - Verbatim MIT license from Phosphor Icons core v2.0.8.
- `docs/week-view-refinement-execution-spec.md`
  - This specification. Append an execution record after implementation.

No files under `data/` should change.

## Required third-party asset source

Use Phosphor Icons core release `v2.0.8` only:

```text
https://github.com/phosphor-icons/core/releases/tag/v2.0.8
```

Raw asset URL pattern:

```text
https://raw.githubusercontent.com/phosphor-icons/core/v2.0.8/assets/{weight}/{filename}.svg
```

Filename conventions:

- regular: `{icon-name}.svg`
- fill: `{icon-name}-fill.svg`
- duotone: `{icon-name}-duotone.svg`

Do not use the Phosphor webfont. Do not add a CDN dependency. Do not install the full icon package. Do not copy icons from a different release.

## Exact icon sprite contract

Create `assets/rowta-icons.svg` with this outer structure:

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-calendar-check-regular" viewBox="0 0 256 256">...</symbol>
  <!-- remaining symbols -->
</svg>
```

For each source SVG:

1. Preserve its `viewBox="0 0 256 256"`.
2. Copy only the source SVG's inner nodes into the corresponding `<symbol>`.
3. Preserve source opacity values in duotone icons.
4. Preserve `fill="currentColor"` or convert fixed black fills to `currentColor`.
5. Do not alter path geometry.
6. Do not add titles inside the sprite; accessible names belong on controls, not decorative sprite symbols.

The sprite must include exactly these symbols:

| Symbol ID | Phosphor source |
| --- | --- |
| `icon-calendar-check-regular` | `assets/regular/calendar-check.svg` |
| `icon-calendar-check-fill` | `assets/fill/calendar-check-fill.svg` |
| `icon-cooking-pot-regular` | `assets/regular/cooking-pot.svg` |
| `icon-cooking-pot-fill` | `assets/fill/cooking-pot-fill.svg` |
| `icon-basket-regular` | `assets/regular/basket.svg` |
| `icon-basket-fill` | `assets/fill/basket-fill.svg` |
| `icon-storefront-regular` | `assets/regular/storefront.svg` |
| `icon-printer-regular` | `assets/regular/printer.svg` |
| `icon-calendar-blank-regular` | `assets/regular/calendar-blank.svg` |
| `icon-calendar-plus-regular` | `assets/regular/calendar-plus.svg` |
| `icon-caret-down-regular` | `assets/regular/caret-down.svg` |
| `icon-caret-up-regular` | `assets/regular/caret-up.svg` |
| `icon-dots-three-regular` | `assets/regular/dots-three.svg` |
| `icon-dots-six-vertical-regular` | `assets/regular/dots-six-vertical.svg` |
| `icon-book-open-text-regular` | `assets/regular/book-open-text.svg` |
| `icon-arrows-clockwise-regular` | `assets/regular/arrows-clockwise.svg` |
| `icon-trash-regular` | `assets/regular/trash.svg` |
| `icon-clock-regular` | `assets/regular/clock.svg` |
| `icon-gauge-regular` | `assets/regular/gauge.svg` |
| `icon-fork-knife-regular` | `assets/regular/fork-knife.svg` |
| `icon-fork-knife-duotone` | `assets/duotone/fork-knife-duotone.svg` |
| `icon-tray-regular` | `assets/regular/tray.svg` |
| `icon-x-regular` | `assets/regular/x.svg` |
| `icon-arrow-counter-clockwise-regular` | `assets/regular/arrow-counter-clockwise.svg` |
| `icon-carrot-duotone` | `assets/duotone/carrot-duotone.svg` |
| `icon-bowl-food-duotone` | `assets/duotone/bowl-food-duotone.svg` |
| `icon-orange-slice-duotone` | `assets/duotone/orange-slice-duotone.svg` |
| `icon-truck-regular` | `assets/regular/truck.svg` |

Copy the MIT license from:

```text
https://raw.githubusercontent.com/phosphor-icons/core/v2.0.8/LICENSE
```

into `assets/PHOSPHOR-LICENSE.txt` without editing its wording.

## Icon markup rules

Add this helper near the other small render helpers in `app.js`:

```js
function iconMarkup(name, className = "") {
  const classes = ["icon", className].filter(Boolean).join(" ");
  return `<svg class="${classes}" aria-hidden="true" focusable="false"><use href="assets/rowta-icons.svg#icon-${name}"></use></svg>`;
}
```

Only pass hard-coded icon names from application source. Never pass recipe data, grocery data, query-string data, or user input into `iconMarkup`.

Static HTML icons must use the equivalent literal structure:

```html
<svg class="icon nav-icon nav-icon-regular" aria-hidden="true" focusable="false">
  <use href="assets/rowta-icons.svg#icon-calendar-check-regular"></use>
</svg>
```

General icon CSS:

```css
.icon {
  display: block;
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  overflow: visible;
  color: currentColor;
}
```

Required size tiers:

- `.icon-inline`: `16px`
- `.icon-control`: `20px`
- `.nav-icon`: `23px`
- `.icon-section`: `32px`
- `.icon-empty`: `44px`

Do not use CSS borders, pseudo-elements, Unicode characters, or emoji to draw an icon that exists in the sprite.

## Exact global icon mapping

Replace current `.tab-icon` CSS drawings and static markup with:

| Control | Inactive icon | Active icon |
| --- | --- | --- |
| Week | `calendar-check-regular` | `calendar-check-fill` |
| Recipes | `cooking-pot-regular` | `cooking-pot-fill` |
| Groceries | `basket-regular` | `basket-fill` |
| Catalog | `storefront-regular` | same |
| Print | `printer-regular` | same |
| Choose another week | `calendar-blank-regular` plus `caret-down-regular` | same |

Each of the three primary navigation buttons must contain both its regular and fill SVG. CSS controls which one is visible:

```css
.nav-icon-fill { display: none; }
.app-nav button.active .nav-icon-regular { display: none; }
.app-nav button.active .nav-icon-fill { display: block; }
```

Do not replace text labels with icons.

## Exact Week-view icon mapping

Use this mapping everywhere the corresponding control or concept appears. Do not choose synonyms from the Phosphor catalog.

| Week-view element | Symbol ID |
| --- | --- |
| Planned-meal drag handle | `icon-dots-six-vertical-regular` |
| Move earlier | `icon-caret-up-regular` |
| Move later | `icon-caret-down-regular` |
| More/actions | `icon-dots-three-regular` |
| View recipe | `icon-book-open-text-regular` |
| Change dinner | `icon-arrows-clockwise-regular` |
| Choose another day | `icon-calendar-blank-regular` |
| Remove from week | `icon-trash-regular` |
| Add/choose dinner | `icon-calendar-plus-regular` |
| Time metadata | `icon-clock-regular` |
| Effort metadata | `icon-gauge-regular` |
| Protein metadata | `icon-fork-knife-regular` |
| Empty dinner decoration | `icon-fork-knife-duotone` |
| Unscheduled section | `icon-tray-regular` |
| Dialog close | `icon-x-regular` |
| Undo | `icon-arrow-counter-clockwise-regular` |
| Weekly-agenda motif | `icon-carrot-duotone`, `icon-bowl-food-duotone`, `icon-orange-slice-duotone` |
| Delivery split accent | `icon-truck-regular` |

Action-sheet buttons and desktop menu items use `.icon-control`. Planned-meal metadata uses `.icon-inline`. More, Earlier, and Later controls never use duotone icons.

## Phase 0 — Protect and measure the current baseline

### Actions

1. Record `git status --short`.
2. Confirm that `app.js`, `index.html`, and `styles.css` are already modified.
3. Do not reset or overwrite those files.
4. Start the local server on a free port.
5. Capture Week-view screenshots at:
   - `1280 × 720`
   - `390 × 844`
   - `320 × 700`
6. Record these baseline facts:
   - seven `.day-card` elements render;
   - six planned meals and one empty day render in the default seed state;
   - desktop drag handles are visible;
   - mobile drag handles are hidden;
   - the current grocery needed count;
   - no page-level horizontal overflow;
   - browser console errors.

### Gate

Do not edit until the local page loads and all current modified files have been identified. If the default planner state differs because browser local storage contains user state, record the actual meal count and continue; do not clear user local storage merely to reproduce the seed state.

## Phase 1 — Replace the mobile grocery CTA with a navigation badge

### Required HTML

Remove this entire element from `index.html`:

```html
<button type="button" class="mobile-grocery-cta" data-view-jump="groceries">...</button>
```

Inside the Groceries navigation button, wrap the icon pair in this exact structure:

```html
<span class="nav-icon-wrap" aria-hidden="true">
  <!-- regular basket SVG -->
  <!-- fill basket SVG -->
  <span id="groceryNavBadge" class="nav-count-badge" hidden></span>
</span>
<span>Groceries</span>
```

Add `id="groceryNavButton"` to that navigation button.

### Required JavaScript

Remove:

- `mobileGroceryCount` from `els`;
- the `els.mobileGroceryCount` assignment in `renderPlanner()`.

Add:

```js
groceryNavButton: document.querySelector("#groceryNavButton"),
groceryNavBadge: document.querySelector("#groceryNavBadge"),
```

Add this exact function:

```js
function renderGroceryNavBadge(neededCount) {
  const count = Math.max(0, Number(neededCount) || 0);
  els.groceryNavBadge.hidden = count === 0;
  els.groceryNavBadge.textContent = count > 99 ? "99+" : String(count);
  els.groceryNavButton.setAttribute(
    "aria-label",
    count === 0 ? "Groceries" : `Groceries, ${count} item${count === 1 ? "" : "s"} to buy`
  );
}
```

Call `renderGroceryNavBadge(groceries.neededCount)` from `renderPlanner()` immediately after updating `plannerGroceryCount`.

The badge count must use `groceries.neededCount`. Do not use total generated rows, delivery item totals, planned recipe count, or pantry count.

### Required badge styling

The badge is mobile-only:

```css
.nav-count-badge {
  display: none;
}

@media (max-width: 760px) {
  .nav-icon-wrap {
    position: relative;
    display: inline-grid;
    place-items: center;
  }

  .nav-count-badge:not([hidden]) {
    position: absolute;
    top: -8px;
    right: -12px;
    display: grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border: 2px solid rgba(255, 252, 246, 0.98);
    border-radius: 999px;
    background: var(--tomato);
    color: #fff;
    font-size: 10px;
    line-height: 1;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
}
```

The badge itself remains `aria-hidden` through its parent. The accessible count is supplied by the navigation button's `aria-label`.

### Gate

- No `.mobile-grocery-cta` remains in HTML, JavaScript, or CSS.
- At zero needed items, no badge is visible and the button is named `Groceries`.
- At one item, the visible badge is `1` and the accessible name is `Groceries, 1 item to buy`.
- At 47 items, the visible badge is `47` and the accessible name includes `47 items to buy`.
- At 120 items, the visible badge is `99+` and the accessible name includes the full `120 items to buy`.
- The planner summary continues to show its existing Shopping count.

## Phase 2 — Make the mobile navigation a distinct floating layer

### Remove obsolete spacing

At `max-width: 760px`, set normal and planner body bottom padding to the same value:

```css
body,
body[data-active-view="planner"] {
  padding-bottom: calc(86px + env(safe-area-inset-bottom));
}
```

Delete the old planner-only `150px` value.

### Add a content-separation scrim

At `max-width: 760px`, use `body::after` as a noninteractive background fade:

```css
body::after {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  height: calc(112px + env(safe-area-inset-bottom));
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(243, 234, 220, 0) 0%,
    rgba(243, 234, 220, 0.7) 48%,
    rgba(243, 234, 220, 0.96) 100%
  );
}
```

Hide this pseudo-element in print.

### Replace the mobile navigation material values

At `max-width: 760px`, the fixed `.app-nav` must use exactly:

```css
width: min(calc(100% - 24px), 430px);
min-height: 62px;
bottom: max(10px, env(safe-area-inset-bottom));
border: 1px solid rgba(255, 255, 255, 0.92);
border-radius: 20px;
background: rgba(255, 252, 246, 0.96);
box-shadow:
  0 -10px 30px rgba(41, 35, 29, 0.16),
  0 12px 30px rgba(41, 35, 29, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.94);
backdrop-filter: blur(24px) saturate(1.16);
-webkit-backdrop-filter: blur(24px) saturate(1.16);
```

Set `isolation: isolate` on the nav. Keep its `z-index: 60`.

Each nav button must be at least `56px` tall. The active button uses:

```css
background: rgba(223, 232, 216, 0.96);
color: var(--herb-dark);
box-shadow: inset 0 0 0 1px rgba(47, 93, 70, 0.1);
```

For browsers without backdrop filtering, use the same `rgba(255, 252, 246, 0.96)` background. Add `.week-bar .app-nav` to the existing `@supports not` fallback list.

### Gate

- The navigation reads as one floating control, not three detached buttons.
- The upper shadow is visible over white cards and food photography.
- The content fade does not block pointer interaction.
- No planned-meal content is permanently obscured at the end of the page.
- Safe-area spacing remains correct.
- The nav does not exceed the viewport at 320px.

## Phase 3 — Replace the planned-meal renderer

### Day-card root

Modify `renderDaySlot()` so each day card includes stable day metadata:

```html
<article
  class="day-card has-meal|empty"
  data-day-index="{index}"
  data-day-name="{full day name}"
>
```

Render the date using a semantic `<time>`:

```html
<div class="day-card-date">
  <span class="day-card-day">Sun</span>
  <time datetime="YYYY-MM-DD">Jul 12</time>
</div>
```

Add a helper that returns local `YYYY-MM-DD` without using `toISOString()`, which can shift dates across time zones:

```js
function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
```

### Planned-meal markup

`renderSlotRecipe(recipe, index)` must return this hierarchy:

```html
<div class="slot-recipe" data-slot-recipe-id="{recipe id}">
  <span
    class="drag-handle"
    draggable="true"
    data-drag-recipe="{recipe id}"
    data-drag-day="{index}"
    aria-hidden="true"
  >
    <!-- dots-six-vertical regular -->
  </span>

  <button class="recipe-thumb-button" data-view-recipe="{recipe id}" ...>
    <!-- image or placeholder -->
  </button>

  <div class="slot-recipe-body">
    <h3>
      <button class="recipe-title-button" data-view-recipe="{recipe id}">...</button>
    </h3>
    <div class="meal-meta" aria-label="Meal details">
      <span><!-- clock --> {totalMinutes} min</span>
      <span><!-- gauge --> {effort or Easy}</span>
      <span><!-- fork-knife --> {primaryProtein or Flex}</span>
    </div>
  </div>

  <div class="slot-recipe-actions">
    <button class="meal-shift-button" data-move-meal-offset="-1" ...>
      <!-- caret-up -->
    </button>
    <button class="meal-shift-button" data-move-meal-offset="1" ...>
      <!-- caret-down -->
    </button>
    <!-- desktop mealMenu -->
    <button class="mobile-meal-actions" data-open-meal-actions="{index}" ...>
      <!-- dots-three -->
    </button>
  </div>
</div>
```

Use `recipe.effort || "Easy"` for the effort label. Do not display `normalizedBase` in the redesigned planned-meal card.

Earlier is disabled when `index === 0`. Later is disabled when `index === 6`.

Required accessible names:

- Earlier button: `Move {recipe title} to {previous full day name}`.
- Later button: `Move {recipe title} to {next full day name}`.
- Mobile More button: `Manage {recipe title}`.
- Drag handle remains `aria-hidden` because keyboard movement is provided separately.

Remove the `draggable`, `data-drag-recipe`, and `data-drag-day` attributes from `.slot-recipe`. Drag must begin only from `.drag-handle`.

Delete `.mobile-meal-hit` from renderer, JavaScript behavior, and CSS. Do not replace it with another invisible overlay.

### Desktop meal menu

Render the desktop overflow menu in this exact order:

1. View recipe — `book-open-text-regular`.
2. Change dinner — `arrows-clockwise-regular`.
3. Move earlier — `caret-up-regular`; disabled on Sunday.
4. Move later — `caret-down-regular`; disabled on Saturday.
5. Choose another day — `calendar-blank-regular`.
6. Remove from week — `trash-regular`; destructive styling.

Use data attributes already defined elsewhere in this specification. Do not encode actions into inline JavaScript.

The `<summary>` accessible name is `Actions for {recipe title}`.

The Choose another day command uses:

```html
<button type="button" data-choose-meal-day="{index}">...</button>
```

Add this delegated handler before the generic recipe-view handler:

```js
const chooseMealDayButton = event.target.closest("[data-choose-meal-day]");
if (chooseMealDayButton) {
  openMealMoveDialog(Number(chooseMealDayButton.dataset.chooseMealDay), chooseMealDayButton);
  return;
}
```

Implement `openMealMoveDialog(dayIndex, trigger)` by calling `openMealActionSheet(dayIndex, trigger)`, rendering the six move choices, hiding `mealActionMenu`, and showing `mealMoveMenu`. Do not create a second move dialog.

### Empty-day markup

`renderAddRecipePrompt()` must use:

- `calendar-plus-regular` as the control icon;
- visible copy `Choose dinner`;
- desktop supporting copy `Drop a recipe here or browse`;
- mobile supporting copy hidden;
- a quiet `fork-knife-duotone` decorative icon on the trailing edge.

The button's accessible name remains `Add dinner for {full day name}`.

### Section food motif

Add one decorative motif to the `Weekly agenda / Dinners by day` section band:

```html
<span class="section-food-motif" aria-hidden="true">
  <span class="food-medallion food-medallion-carrot"><!-- carrot-duotone --></span>
  <span class="food-medallion food-medallion-bowl"><!-- bowl-food-duotone --></span>
  <span class="food-medallion food-medallion-orange"><!-- orange-slice-duotone --></span>
</span>
```

Use three overlapping `30px` circular medallions on desktop. Use only the bowl-food medallion on mobile; hide the first and third icons at `max-width: 760px`.

These icons are decorative. They must not receive labels, focus, tooltips, or click behavior.

Use these exact styles:

```css
.section-food-motif {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 14px;
}

.food-medallion {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-left: -8px;
  border: 2px solid rgba(255, 253, 247, 0.94);
  border-radius: 999px;
}

.food-medallion:first-child { margin-left: 0; }
.food-medallion .icon { width: 22px; height: 22px; }
.food-medallion-carrot { background: var(--apricot-soft); color: var(--apricot-dark); }
.food-medallion-bowl { background: var(--sage); color: var(--herb-dark); }
.food-medallion-orange { background: var(--lemon-soft); color: #8a6816; }

@media (max-width: 760px) {
  .food-medallion-carrot,
  .food-medallion-orange { display: none; }
  .food-medallion-bowl { margin-left: 0; }
}
```

### Delivery-panel icon accent

Wrap the `Generated from recipes` eyebrow and `Delivery split` heading in a `.delivery-heading` row. Add one decorative `truck-regular` icon inside a `.delivery-heading-icon` before the text block. The icon is `aria-hidden`.

Use:

```css
.delivery-heading {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.delivery-heading-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(223, 232, 216, 0.86);
  color: var(--herb-dark);
}

.delivery-heading-icon .icon {
  width: 22px;
  height: 22px;
}
```

## Phase 4 — Apply the exact planned-meal visual system

### Desktop and tablet above 760px

Use:

```css
.day-slots {
  gap: 10px;
}

.day-card {
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 12px;
  min-height: 108px;
  padding: 10px;
  border-radius: 14px;
}

.day-card.has-meal {
  border: 1px solid rgba(205, 189, 167, 0.88);
  background: rgba(255, 253, 247, 0.94);
  box-shadow: 0 2px 8px rgba(41, 35, 29, 0.045);
}

.slot-recipe {
  grid-template-columns: 20px 116px minmax(0, 1fr) auto;
  gap: 14px;
  min-height: 86px;
}

.slot-recipe img,
.slot-recipe .recipe-thumb {
  width: 116px;
  height: 86px;
  border-radius: 11px;
}
```

Day token:

- day abbreviation: `12px`, uppercase, `700`, apricot-dark;
- date: `14px`, `700`, ink;
- right divider: `1px solid rgba(205, 189, 167, 0.58)`;
- no circular date bubble;
- keep the token vertically centered.

Title:

- `16px` at desktop;
- `21px` line height;
- `700` weight;
- maximum two lines;
- no underline by default;
- underline only on hover of the title itself.

Metadata:

- each item is an inline flex pair with a `16px` icon;
- text is `12px`, `600`, muted;
- gap between icon and text is `4px`;
- gap between metadata items is `10px`;
- remove the current bullet pseudo-separators.

Actions:

- Earlier and Later buttons are `34 × 34px`.
- Overflow summary is `34 × 34px`.
- All three are always visible at `0.72` opacity.
- Increase to `1` on card hover, focus-within, or button hover.
- Disabled shift buttons remain visible at `0.26` opacity and are not clickable.
- Do not hide movement controls until hover; discoverability is a requirement.

Hover:

- card translation: `translateY(-2px)`;
- shadow: `0 12px 26px rgba(75, 59, 39, 0.1)`;
- transition duration: `180ms`.

### Mobile at 760px and below

Use:

```css
.day-card {
  grid-template-columns: 50px minmax(0, 1fr);
  gap: 8px;
  min-height: 104px;
  padding: 8px;
  border-radius: 13px;
}

.slot-recipe {
  grid-template-columns: 72px minmax(0, 1fr) 44px;
  gap: 10px;
  min-height: 76px;
}

.slot-recipe img,
.slot-recipe .recipe-thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
}
```

At mobile widths:

- hide `.drag-handle`;
- hide `.meal-shift-button`;
- hide `.meal-menu`;
- show `.mobile-meal-actions` as a `44 × 44px` control;
- keep image and title buttons interactive and above no overlay;
- clamp the title to two lines;
- display only the clock and protein metadata items;
- hide the effort metadata item;
- do not apply hover translation.

At `max-width: 360px`, use:

```css
.day-card {
  grid-template-columns: 44px minmax(0, 1fr);
}

.slot-recipe {
  grid-template-columns: 60px minmax(0, 1fr) 40px;
  gap: 8px;
}

.slot-recipe img,
.slot-recipe .recipe-thumb {
  width: 60px;
  height: 60px;
}

.mobile-meal-actions {
  width: 40px;
  height: 44px;
}
```

Do not hide the photo, day, title, More button, or clock metadata to make 320px fit.

### Empty day

Empty days use the same `76px` desktop or `50px` mobile day column as planned days. The add tile must fill the content column and have:

- minimum height `74px` desktop;
- minimum height `68px` mobile;
- border `1px dashed rgba(47, 93, 70, 0.3)`;
- background `rgba(223, 232, 216, 0.22)`;
- icon and primary copy in herb;
- decorative duotone icon at `44px` with `0.42` opacity.

## Phase 5 — Implement deterministic Earlier, Later, and full-day movement

### Click delegation

Add the movement handler before the existing recipe-view handler:

```js
const shiftMealButton = event.target.closest("[data-move-meal-offset]");
if (shiftMealButton) {
  moveMealByOffset(
    Number(shiftMealButton.dataset.dayIndex),
    Number(shiftMealButton.dataset.moveMealOffset),
    shiftMealButton
  );
  return;
}
```

Every Earlier/Later button, including buttons rendered inside the desktop overflow menu, must include both:

- `data-day-index="{index}"`
- `data-move-meal-offset="-1|1"`

### Undo state

Add these module-level variables near the existing action-sheet state:

```js
let plannerUndo = null;
let plannerToastTimer = null;
```

The undo snapshot is ephemeral and must not be persisted to local storage.

Snapshot shape:

```js
{
  weekKey,
  slots,
  unscheduled,
  recipeId,
  fromIndex,
  targetIndex
}
```

Where:

- `slots` is `plan.slots.map((slot) => slot.recipeId)`;
- `unscheduled` is a cloned array;
- `recipeId` is the meal being moved.

### Movement function

Implement:

```js
function moveMealByOffset(fromIndex, offset, trigger) {
  const targetIndex = fromIndex + offset;
  if (!Number.isInteger(fromIndex) || ![-1, 1].includes(offset)) return;
  if (targetIndex < 0 || targetIndex >= activePlan().slots.length) return;

  const recipeId = activePlan().slots[fromIndex]?.recipeId;
  if (!recipeId) return;

  moveRecipeToDay(
    { recipeId, fromDay: String(fromIndex), fromUnscheduled: "" },
    targetIndex,
    { allowUndo: true, focusRecipeId: recipeId, focusAction: offset }
  );
}
```

`trigger` is accepted for event-call consistency but is not used after rerendering. Focus restoration is recipe-based.

### Extend `moveRecipeToDay`

Change the signature to:

```js
function moveRecipeToDay(payload, targetIndex, options = {})
```

Before mutating, when `options.allowUndo` is true, save the undo snapshot.

After the existing mutation:

1. `saveState()`.
2. `renderAll()`.
3. If `options.focusRecipeId` exists, restore focus on the same logical recipe.
4. If `options.allowUndo`, show the toast.

Do not change the existing swap algorithm. The current behavior of assigning the target recipe back to the source slot is correct.

Full-day moves from the action dialog must also pass `allowUndo: true`.

Unscheduled-to-day moves must pass `allowUndo: true`; their undo snapshot restores the unscheduled list and all slots.

The drop handler must pass `{ allowUndo: true, focusRecipeId: payload.recipeId }` when it calls `moveRecipeToDay()`.

Extend `moveRecipeToUnscheduled` to accept `options = {}` and use the same snapshot, save, render, focus, toast, and six-second Undo path. Its message is:

```text
{Recipe title} moved to Unscheduled.
```

The drop handler must pass `{ allowUndo: true, focusRecipeId: payload.recipeId }` when it calls `moveRecipeToUnscheduled()`.

For unscheduled recipe markup, remove `draggable`, `data-drag-recipe`, and `data-drag-unscheduled` from `.unscheduled-meal`. Put those three attributes on its `.drag-handle` instead. This makes planned and unscheduled drag behavior consistent.

### Focus restoration

Implement:

```js
function focusPlannedRecipeAction(recipeId, preferredOffset = null) {
  requestAnimationFrame(() => {
    const card = [...document.querySelectorAll("[data-slot-recipe-id]")]
      .find((item) => item.dataset.slotRecipeId === recipeId);
    if (!card) return;
    const preferred = preferredOffset === null
      ? card.querySelector("[data-open-meal-actions], .meal-menu summary")
      : card.querySelector(`[data-move-meal-offset="${preferredOffset}"]:not(:disabled)`);
    (preferred || card.querySelector("[data-view-recipe]"))?.focus({ preventScroll: true });
  });
}
```

Do not build an unescaped CSS selector from `recipeId`.

### Undo markup

Add immediately after the meal action dialog:

```html
<div id="plannerToast" class="planner-toast" hidden>
  <span id="plannerToastMessage" role="status" aria-live="polite"></span>
  <button type="button" data-undo-planner-move>
    <!-- arrow-counter-clockwise regular -->
    Undo
  </button>
</div>
```

### Undo behavior

When a move completes, the message is:

```text
{Recipe title} moved to {full target day name}.
```

Show the toast for exactly `6000ms`.

`undoPlannerMove()` must:

1. Return if `plannerUndo` is null.
2. Restore recipe IDs into the recorded week's seven existing slot objects; do not replace the slot objects or their `day` fields.
3. Restore the cloned `unscheduled` array.
4. Clear the timer and undo state.
5. Save state.
6. Render all.
7. Announce `Move undone.` in the status span.
8. Restore focus to the moved recipe in its original slot.

Clear pending undo without restoring it when:

- the toast expires;
- a different week is selected;
- a recipe is changed or removed;
- a recipe is added to the week or assigned from the recipe picker;
- the user navigates away from the planner view;
- another movement begins.

A new movement replaces the previous undo snapshot.

Implement one `clearPlannerUndo()` helper that clears the timeout, nulls `plannerUndo`, hides `plannerToast`, and clears the toast status text. Call it from these exact paths:

- the `[data-week-key]` handler before changing `state.activeWeek`;
- `assignRecipeToDay()` before mutation;
- `removeRecipeFromDay()` before mutation;
- `addUnscheduledRecipe()` when called for a non-move add;
- `removeUnscheduledRecipe()` before mutation;
- `removeRecipeFromWeek()` when called for a non-move change or removal;
- `setView()` when `viewName !== "planner"`;
- the start of any new move, immediately before recording the replacement undo snapshot.

Because `addUnscheduledRecipe()` and `removeRecipeFromWeek()` are also used internally by movement, add an options argument with `preserveUndo: true` for those internal movement calls. Internal move plumbing must not clear the snapshot that was just recorded.

### Toast styling

Desktop:

- fixed bottom `24px`;
- horizontally centered;
- max width `420px`;
- warm card background;
- border, lift shadow, `14px` radius;
- minimum height `48px`.

Mobile:

- bottom `calc(84px + env(safe-area-inset-bottom))`;
- width `min(calc(100% - 32px), 390px)`;
- z-index `80`, above nav and scrim but below the action dialog.

The Undo button must be at least `44px` tall on mobile.

## Phase 6 — Replace the custom meal sheet with a native dialog

### Required HTML

Replace the current `#mealActionSheet` wrapper, backdrop button, and nested dialog section with:

```html
<dialog id="mealActionDialog" class="meal-action-dialog" aria-labelledby="mealActionTitle">
  <header>...</header>
  <div id="mealActionMenu" class="meal-action-menu">
    <div id="mealQuickMove" class="meal-quick-move">
      <button type="button" data-meal-action="earlier">...</button>
      <button type="button" data-meal-action="later">...</button>
    </div>
    <button type="button" data-meal-action="view">...</button>
    <button type="button" data-meal-action="change">...</button>
    <button type="button" data-meal-action="move">...</button>
    <button type="button" class="danger-action" data-meal-action="remove">...</button>
  </div>
  <div id="mealMoveMenu" class="meal-move-menu" hidden>...</div>
</dialog>
```

The header close button uses `x-regular`, visible text remains absent, and its accessible name is `Close meal actions`.

Every menu action includes a regular Phosphor icon and visible text.

Earlier and Later each contain:

- an icon;
- a strong label `Earlier` or `Later`;
- a subordinate `<span>` that is updated to either `Move to Monday`, `Swap with Monday`, or `Unavailable`.

### Required JavaScript changes

Rename the element reference from `mealActionSheet` to `mealActionDialog`.

Opening:

```js
els.mealActionDialog.showModal();
document.body.classList.add("meal-sheet-open");
```

Closing:

```js
els.mealActionDialog.close();
```

Use the dialog's `close` event to:

- remove `meal-sheet-open`;
- clear action-sheet state;
- restore focus when the source control still exists.

Use the dialog's `cancel` event only to allow normal Escape behavior. Do not prevent the event.

Remove:

- the custom backdrop button;
- the global Escape key handler used only for the custom sheet;
- all `.meal-action-sheet` CSS;
- all custom backdrop CSS.

### Quick movement state

When a scheduled meal opens:

- show `#mealQuickMove`;
- show Change dinner;
- enable or disable Earlier/Later from its current index;
- use the adjacent slot to choose `Move to {day}` versus `Swap with {day}`.

When an unscheduled meal opens:

- hide `#mealQuickMove`;
- hide Change dinner;
- keep View recipe, Choose another day, and Remove from week.

When the sheet action is `earlier` or `later`:

1. Capture the current index and recipe ID.
2. Close the dialog.
3. Call `moveMealByOffset()` after close state is settled.

Use a zero-delay `setTimeout` only for this close-then-move handoff. Do not use arbitrary animation sleeps.

### Dialog styling

Mobile at `max-width: 760px`:

- bottom sheet;
- `width: min(100%, 560px)`;
- `margin: auto auto 0`;
- border radius `24px 24px 0 0`;
- maximum height `78vh`;
- backdrop `rgba(41, 35, 29, 0.34)` plus `blur(3px)`;
- two-column quick-move grid;
- all action buttons at least `48px` tall.

Desktop above 760px:

- centered modal;
- width `min(calc(100% - 40px), 520px)`;
- margin `auto`;
- border radius `20px` on all corners;
- maximum height `min(680px, calc(100vh - 48px))`.

Use `dialog::backdrop`, not a separate backdrop element.

### Gate

- Tab focus cannot leave the open modal dialog.
- Escape closes the dialog.
- Close button closes the dialog.
- Focus returns to the invoking More control if it still exists.
- Image and title buttons remain directly clickable on mobile.
- Earlier/Later state is correct on Sunday, Saturday, occupied adjacent days, and empty adjacent days.

## Phase 7 — Consolidate the CSS instead of adding another override layer

The current stylesheet contains older base rules and a later `Focused week navigation and touch-first planner controls` override block. This phase must edit and consolidate the affected selectors rather than append a third planner override block.

For each selector below, retain one base definition and only necessary breakpoint overrides:

- `.tab-icon` or its replacement `.icon`;
- `.week-bar .app-nav`;
- `.day-slots`;
- `.day-card` and variants;
- `.day-card-date` and children;
- `.day-content`;
- `.slot-recipe` and children;
- `.drag-handle`;
- `.meal-meta`;
- `.meal-menu`;
- `.add-recipe-tile`;
- `.mobile-meal-actions`;
- `.meal-action-dialog` and children;
- `.planner-toast`;
- `.mobile-grocery-cta`, which must be deleted completely.

Delete the CSS-drawn icon rules for:

- `.calendar-icon`;
- `.book-icon`;
- `.basket-icon`;
- `.pantry-icon`;
- `.print-icon`;
- any unused `.filter-icon` drawing if no element uses it.

Do not change unrelated recipe-detail selectors while consolidating the Week styles.

## Phase 8 — Reduced motion, accessibility, and interaction details

### Reduced motion

In `prefers-reduced-motion: reduce`:

- no card translate animation;
- no swap movement animation;
- no animated toast entrance;
- focus restoration and Undo still occur immediately.

### Focus

- All visible icon-only controls require `aria-label`.
- Disabled movement controls use native `disabled`.
- Focus rings must remain visible above card shadows.
- A moved card must not lose keyboard focus into the document body.
- The Groceries badge cannot receive focus.

### Drag

- Desktop drag starts only from `.drag-handle`.
- The recipe image, title, shift buttons, and overflow menu must not initiate a drag.
- Mobile and coarse-pointer CSS hides the drag handle.
- Drop targets retain the current visible `drag-over` outline.
- Keyboard movement remains available even when drag is supported.

### Status and error prevention

- Moving a meal provides a live status message.
- Undo restores both swapped meals, not just the initiating recipe.
- Remove remains the last action and uses tomato text/icon color.
- Movement never deletes a recipe from the week.
- Boundary movement commands are disabled instead of wrapping Sunday to Saturday.

## Phase 9 — Print behavior

The print stylesheet must hide:

- `.app-nav`;
- `.nav-count-badge`;
- `.meal-action-dialog`;
- `.planner-toast`;
- `.slot-recipe-actions`;
- `.drag-handle`;
- `.section-food-motif`.

Recipe titles, dates, photos, and metadata may remain if the Week view is printed. Do not alter the existing recipe-detail print layout.

## Phase 10 — Static validation

Run from `D:\Projects\family-grocery-planner`.

Use the configured VS Code runtime if `node` is not on `PATH`:

```powershell
$env:ELECTRON_RUN_AS_NODE='1'
& "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe" --check app.js
& "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe" scripts\validate-recipes.mjs
git diff --check
```

Required searches:

```powershell
rg -n "mobile-grocery-cta|mobileGroceryCount|mobile-meal-hit|mealActionSheet|calendar-icon|book-icon|basket-icon|pantry-icon|print-icon" index.html app.js styles.css
```

Expected result: zero active references. A reference inside this documentation file does not count.

Verify all sprite references resolve:

```powershell
rg -o 'rowta-icons\.svg#icon-[a-z0-9-]+' index.html app.js | Sort-Object -Unique
```

Every ID after `#` must exist once in `assets/rowta-icons.svg`.

Verify no data file changed:

```powershell
git status --short data
```

Expected result: no new changes caused by this execution.

## Phase 11 — Required browser validation

Use the real rendered local application. Source inspection alone is not sufficient.

### Viewports

Test exactly:

| Viewport | Purpose |
| --- | --- |
| `1440 × 900` | Wide desktop card hierarchy and menu positioning |
| `1280 × 720` | Normal desktop and delivery-sidebar relationship |
| `761 × 900` | Last desktop interaction width |
| `760 × 900` | First mobile interaction width |
| `390 × 844` | Normal phone |
| `320 × 700` | Narrow phone |

### Week navigation

At every viewport:

- exactly two primary week buttons render;
- later-week menu contains exactly three weeks;
- current, next, and a later week can each be selected;
- the planner label follows the active week;
- all seven days remain visible;
- no page-level horizontal overflow appears.

### Grocery badge

At mobile widths:

- badge is attached to the basket icon, not the label;
- badge does not collide with the active pill edge;
- badge remains readable at one, two, and three display characters;
- no separate grocery CTA exists;
- tapping Groceries navigates correctly;
- the active filled basket and badge remain visually distinct.

At desktop widths:

- the badge is not visible;
- the Groceries accessible name may still include the item count.

### Planned-meal cards

At desktop:

- photography is `116 × 86px` within one pixel;
- shift controls and More are visible without hover;
- all controls become fully opaque on hover or focus-within;
- image opens the recipe;
- title opens the recipe;
- drag begins only from the drag handle;
- overflow menu appears above neighboring cards and is not clipped.

At `390px`:

- photography is `72 × 72px` within one pixel;
- image opens the recipe directly;
- title opens the recipe directly;
- More opens the action dialog;
- drag handles and desktop shift controls are not visible;
- the card does not overflow or truncate the More button.

At `320px`:

- photography is `60 × 60px` within one pixel;
- title may wrap to two lines but not three;
- clock and protein metadata remain readable;
- More retains a `40 × 44px` target;
- no horizontal overflow appears.

### Movement scenarios

Test and then Undo each scenario so the user's plan is restored:

1. Move Sunday's recipe later onto occupied Monday.
   - recipes swap;
   - toast names Monday;
   - Undo restores both recipes.
2. Move Friday's recipe later onto empty Saturday.
   - Friday becomes empty;
   - Saturday receives the recipe;
   - Undo restores Friday and empties Saturday.
3. Open Sunday's action dialog.
   - Earlier is disabled;
   - Later describes Monday as a swap.
4. Open Saturday after moving a recipe there.
   - Later is disabled.
5. Use Choose another day.
   - six destinations render;
   - occupied destinations say `Swap with {recipe}`;
   - empty destinations say `Open night`.
6. Use keyboard focus to move a recipe.
   - focus returns to the same recipe after rerender.
7. Add an unscheduled recipe and choose a day from mobile.
   - no drag is required;
   - Undo restores it to Unscheduled.

### Dialog

- dialog opens modally;
- background controls cannot receive tab focus;
- Escape closes it;
- close button closes it;
- focus returns correctly;
- body scrolling is restored after close;
- no action from a previously opened recipe leaks into the next opening.

### Floating navigation

At `390 × 844` and `320 × 700`:

- a visible upper shadow separates the bar from a pale meal card;
- the same separation remains over a food image;
- the scrim does not look like a second rectangular toolbar;
- final page content can scroll above the bar;
- the navigation remains inset by at least `12px` on both sides;
- the safe-area expression remains in computed styles.

### Console

After all interactions:

- zero JavaScript errors;
- zero missing SVG asset errors;
- zero invalid `<use>` reference errors;
- zero dialog errors.

Reset any temporary viewport override after testing.

## Acceptance checklist

- [ ] Existing uncommitted work was preserved.
- [ ] No `data/` files changed.
- [ ] Standalone mobile grocery CTA is gone.
- [ ] Groceries displays a mobile-only remaining-item badge.
- [ ] Badge hides at zero and caps visually at `99+`.
- [ ] Grocery navigation has a correct accessible count.
- [ ] Mobile nav has an opaque warm material, light rim, upper shadow, and background fade.
- [ ] Mobile planner bottom padding is no longer sized for two floating controls.
- [ ] All seven days remain visible.
- [ ] Planned meals read as agenda entries with larger photography.
- [ ] Desktop images are `116 × 86px`.
- [ ] Normal mobile images are `72 × 72px`.
- [ ] Narrow mobile images are `60 × 60px`.
- [ ] Image and title open the recipe directly on mobile.
- [ ] No invisible full-card overlay remains.
- [ ] Mobile has a visible More button.
- [ ] Desktop has visible Earlier, Later, and More controls.
- [ ] Drag begins only from the desktop drag handle.
- [ ] Earlier/Later never wrap across week boundaries.
- [ ] Occupied movement swaps recipes.
- [ ] Empty movement leaves the source empty.
- [ ] Every movement provides a six-second Undo.
- [ ] Undo restores all seven slot values and Unscheduled state.
- [ ] Focus follows the logical recipe after movement.
- [ ] Meal actions use a native modal dialog.
- [ ] Dialog traps focus and closes with Escape.
- [ ] Phosphor v2.0.8 icons are vendored locally.
- [ ] Phosphor MIT license is included.
- [ ] Regular icons represent actions.
- [ ] Fill icons represent active navigation.
- [ ] Duotone icons provide restrained food personality.
- [ ] CSS-drawn global icons are removed.
- [ ] Platform emoji is not used.
- [ ] Affected duplicate CSS rules are consolidated.
- [ ] Reduced-motion behavior is respected.
- [ ] Print controls and decorative icons are hidden.
- [ ] JavaScript syntax check passes.
- [ ] Recipe validation still passes.
- [ ] `git diff --check` passes except harmless line-ending notices.
- [ ] Browser console remains clean.
- [ ] No horizontal overflow appears at any required viewport.

## Failure and fallback rules

1. If an external SVG `<use>` reference does not render in the local server, inline the same completed sprite as a visually hidden `<svg>` immediately after `<body>`. Keep the same symbol IDs and helper contract. Do not change icon libraries.
2. If the 320px layout overflows, apply the specified `max-width: 360px` dimensions. Do not hide the photo, title, More button, or day.
3. If the mobile nav still blends into content, increase only its background alpha from `0.96` to `0.98`. Do not add another floating container or stronger brand-color fill.
4. If a native dialog platform defect appears in the supported browser, document the exact defect and stop. Do not silently restore the current non-trapping custom dialog.
5. If focus restoration cannot find the moved recipe, focus `#daySlots` only after adding `tabindex="-1"`; never leave focus on a removed DOM node or reset it to `body`.
6. If a requested Phosphor source file is missing, verify the exact `v2.0.8` path and filename suffix. Do not substitute an icon from another family.
7. If drag conflicts with image/title clicks, confirm that only `.drag-handle` owns `draggable="true"`. Do not disable the direct recipe links.
8. If Undo would overwrite a newer non-move plan edit, clear the undo state before that edit. Do not restore stale snapshots.
9. Do not solve layout failures by changing recipe titles, hiding days, or changing grocery counts.

## Required execution record

After implementation, append a new section to this file with:

```markdown
## Execution record — YYYY-MM-DD

### Files changed

### Implemented decisions

### Deviations

### Static validation

### Browser validation

### Remaining limitations
```

If there are no deviations or remaining limitations, write `None.` explicitly. Do not leave those headings blank.

## Execution record — 2026-07-13

### Files changed

- `app.js`
- `index.html`
- `styles.css`
- `assets/rowta-icons.svg`
- `assets/PHOSPHOR-LICENSE.txt`

### Implemented decisions

- Removed the standalone mobile grocery call-to-action and added the live, mobile-only Groceries badge driven by `groceries.neededCount`.
- Rebuilt planned meals as editorial itinerary cards with direct image/title recipe access, explicit desktop Earlier/Later/More controls, a mobile More control, and handle-only desktop drag.
- Added deterministic movement, swapping, an all-plan undo snapshot, six-second Undo, focus restoration, and a native HTML dialog for full meal actions.
- Replaced the CSS-drawn global icon system with the vendored Phosphor v2.0.8 sprite and included its MIT license.
- Applied the documented external-`use` fallback by loading the vendored symbols into the page, adding explicit icon `viewBox` values, and switching rendered references to local symbol IDs. This prevents browsers from hiding the artwork through external-sprite behavior.
- Added conventional dropdown dismissal: clicking outside an open week or meal menu closes it, opening another menu closes the previous one, selecting a menu command closes its dropdown, and Escape closes the active dropdown while restoring focus to its summary.
- Added the required mobile floating-navigation material, content fade, responsive meal-card dimensions, print exclusions, and reduced-motion-compatible transitions.
- Refined planned-meal content into a restaurant-menu hierarchy: the full dish name takes priority, followed by a concise ingredient-led description. Removed time, cooking-vessel format, repeated difficulty, default-protein, metadata icons, and week-specific callouts from the meal rows.
- Added hand-authored menu descriptions for the six meals in the current plan as a bounded copy prototype. Other catalog entries continue to fall back to their existing overview until their menu copy is curated.
- Normalized the desktop section navigation and week controls to the same 44px visual height, combined This week, Next week, and More weeks into one control group, and shortened the picker label.
- Removed the decorative food medallions from the agenda heading so that area no longer suggests hidden or missing controls.
- Moved the planner/sidebar collapse to 1100px to prevent the meal content from becoming compressed between the photograph and action controls at intermediate widths.

### Deviations

- Focus restoration keeps the specified `requestAnimationFrame` path and adds a zero-delay fallback only when focus is still on `body`. The fallback was required because the background test browser can defer animation frames after a synchronous planner rerender.
- The final meal-row refinement intentionally replaces the original icon-led metadata treatment, `format · time` experiment, week callouts, and decorative food motif with a quieter restaurant-menu hierarchy after rendered review showed that operational signals added noise rather than differentiation.

### Static validation

- The configured VS Code runtime passed `--check app.js`.
- `scripts/validate-recipes.mjs` passed.
- `git diff --check` completed without whitespace errors; Git printed only existing line-ending notices.
- All application icon references resolve to the 28 unique symbols required in `assets/rowta-icons.svg`.
- `assets/PHOSPHOR-LICENSE.txt` matches the Phosphor core v2.0.8 license after newline normalization.
- Obsolete CTA, overlay, custom-sheet, and CSS-drawn icon selectors have zero active references.
- No files under `data/` changed.

### Browser validation

- Completed against the rendered local application at `1440 × 900`, `1280 × 720`, `761 × 900`, `760 × 900`, `390 × 844`, and `320 × 700`.
- Verified seven day cards, six planned meals, one empty day, desktop-only drag handles, mobile-only More controls, `116 × 86`, `72 × 72`, and `60 × 60` recipe imagery, and zero page-level horizontal overflow at every required viewport.
- Found and fixed a real narrow-layout overflow caused by the mobile week-picker label remaining visible. The week picker now collapses to its labeled calendar button without clipping at 390px or 320px.
- Verified two primary week choices, three later-week choices, current/next/later selection, and restoration to the current week.
- Verified the 47-item mobile grocery badge, inset floating navigation, rendered vendored SVG icons, and zero browser console errors or missing-asset errors.
- Re-audited icon visibility after the fallback: all 108 rendered icon references use the 28-symbol inline sprite, visible desktop and mobile icons have nonzero dimensions, dialog actions expose all seven required icons, and no oversized or unresolved icons remain.
- Corrected compounded desktop action opacity so Earlier, Later, and More receive the specified visibility once, while mobile More remains fully opaque and drag handles remain visibly secondary.
- Verified click-away dismissal for both the later-week picker and desktop meal menu, verified menu-to-menu switching, and verified Escape dismissal with focus restoration.
- Verified occupied-day swapping and Undo, moving Friday to an empty Saturday and Undo, six full-day choices, correct swap/open-night descriptions, close-button dialog behavior, and focus restoration on both desktop and mobile.
- Verified the user's plan and active week were restored after movement testing.
- Revalidated the refined layout at `1280 × 720`, `1101 × 800`, `1100 × 800`, `981 × 800`, `980 × 800`, `760 × 900`, `390 × 844`, and `320 × 700`. The meal body matches the image height at desktop and mobile sizes, the contextual callouts are limited to two and hidden on mobile, and every viewport has zero horizontal overflow.
- Verified the unified desktop week control, equal-height top controls, `More weeks` label, restaurant-menu meal copy, absence of decorative agenda motifs, and clean browser console.
- Reverified click-away dismissal for both the More weeks picker and a desktop meal menu after the layout refinement.
- Verified the six curated menu descriptions at `1280 × 720`, `760 × 900`, `390 × 844`, and `320 × 700`. Normal desktop rows show up to two description lines; normal mobile gives the complete dish name up to three lines and yields description space first; the narrowest layout clamps both safely. Truncated copy renders an ellipsis, the complete text remains in the DOM and title tooltip, and no viewport develops horizontal overflow.

### Remaining limitations

- The browser automation surface did not dispatch a native dialog cancel when synthesizing Escape, although the native `<dialog>` close button, modal state, close event, body-scroll restoration, and focus return all passed. A physical Escape-key check remains advisable before release.

## Research references

- Apple tab-bar badge guidance: <https://developer.apple.com/design/human-interface-guidelines/tab-bars?changes=_1>
- Apple Liquid Glass adoption guidance: <https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass?changes=la__9>
- Apple drag-and-drop alternatives: <https://developer.apple.com/design/human-interface-guidelines/drag-and-drop?changes=_3>
- Apple list reordering guidance: <https://developer.apple.com/design/human-interface-guidelines/lists-and-tables>
- Apple interface-icon consistency: <https://developer.apple.com/design/human-interface-guidelines/icons?changes=_5>
- 2026 Apple Design Awards: <https://developer.apple.com/design/awards/>
- WCAG drag alternative technique: <https://www.w3.org/WAI/WCAG22/Techniques/general/G219.html>
- Phosphor Icons: <https://phosphoricons.com/>
- Phosphor core v2.0.8: <https://github.com/phosphor-icons/core/releases/tag/v2.0.8>
