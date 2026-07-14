# Rowta Recipe Ingredient Access Plan

## Document Status

- **Status:** Ready for implementation
- **Scope:** Recipe detail pages for both structured and legacy recipes
- **Primary files:** `app.js`, `styles.css`, `index.html`, and structured recipe data
- **Related documents:**
  - [Recipe Experience Plan](./recipe-experience-plan.md)
  - [Recipe Page Simplification Plan](./recipe-simplification-plan.md)

## Purpose

The current structured recipe page keeps the complete ingredient card visible beside the instructions as the user scrolls. This makes the complete list feel like permanent interface furniture even after the cook has moved into stage-specific work.

The persistent rail creates four problems:

1. It gives the complete ingredient list nearly the same visual priority as the active instructions.
2. It repeats information already presented in each structured stage's `You'll need` list.
3. It leaves a large, visually inactive column beside later stages.
4. It makes structured recipes feel denser than legacy recipes, even though the structured content is more useful.

The target experience should preserve the complete ingredient list without forcing it to follow the user. Ingredients should behave as:

- An **overview** before cooking begins.
- A **stage-specific working set** during structured cooking.
- An **on-demand reference** from anywhere in the recipe.

The central design principle is:

> Show the complete ingredient list once, then make it easy to summon rather than making it persist.

## Decision Summary

The implementation should make the following changes:

1. Move the complete ingredient list out of the sticky left rail.
2. Render it as a normal-flow overview between the recipe hero and the method.
3. Use a compact responsive grid so the overview does not create an unnecessarily long preamble.
4. Move the stage navigator below the ingredient overview, where it becomes sticky as the user enters the method.
5. Add a persistent `Ingredients` control to the sticky stage navigator.
6. Open the complete list in a right-side sheet on desktop and a bottom sheet on mobile.
7. Keep structured stage-specific ingredient lists inline with their stages.
8. Let legacy recipes use the same overview and on-demand sheet even though they do not have stage-specific ingredient mappings.
9. Add an enhancement that emphasizes the current stage's direct ingredients inside the on-demand sheet.
10. Keep the complete ingredient list fully expanded in print.

## Goals

### Primary goals

- Make instructions the dominant visual and reading path.
- Preserve easy access to the complete ingredient list at every scroll position.
- Give structured and legacy recipes one consistent page architecture.
- Retain the value of stage-specific ingredient allocation.
- Reduce persistent visual density without hiding useful information.
- Ensure the ingredient reference works on desktop, tablet, mobile, keyboard, and assistive technology.

### Secondary goals

- Create a foundation for future serving scaling and ingredient check-off.
- Make equipment accessible without keeping it in a permanent rail.
- Allow the current stage to provide useful context inside the complete list.
- Preserve the user's method scroll position when opening and closing ingredients.

## Non-goals

This project should not introduce:

- Ingredient checkboxes.
- Persistent ingredient completion state.
- Serving-size scaling.
- Automatic quantity arithmetic.
- Timers.
- A dedicated cook-mode route.
- Pantry substitutions inside the ingredient sheet.
- Automatic inference of stage ingredients for legacy recipes.
- Reordering the complete list every time the active stage changes.

These may be considered later, but they should not complicate the first implementation.

## Comparison That Informs the Design

### What legacy recipes currently do well

- They have a calm, direct method column.
- Stage boundaries are easy to see.
- Instructions receive most of the visual attention.
- The complete ingredient list is compact.

### What structured recipes currently do well

- Action leads are easy to scan at the stove.
- Stage-specific ingredients reduce cross-referencing.
- Divided quantities can be shown at the moment they are used.
- Contextual safety and family guidance can appear at the correct decision point.
- Stage durations and structured outcomes support future cooking tools.

### What the target should combine

The target should preserve:

- The visual calm of the legacy method.
- The operational clarity of the structured method.
- A single complete ingredient reference.
- Compact stage-specific working sets where the data exists.

## Target Information Architecture

The new recipe page order should be:

```text
Recipe header
Recipe hero and summary
Complete ingredient overview
Sticky stage navigation + Ingredients control
Centered method
```

The complete ingredient list should no longer share a permanent two-column grid with the method.

### Desktop page model

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Recipe hero                                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ INGREDIENTS                                             Serves 4     │
│                                                                     │
│ Chicken                 Pasta and sauce          To finish          │
│ • 1½ lb cutlets         • 12 oz pasta            • Parsley          │
│ • ½ cup flour           • 4 tbsp butter                              │
│ • 2 tbsp olive oil      • 2 lemons                                   │
│                                                                     │
│ Equipment: Large pot · Large skillet · Thermometer                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 1 Prep   2 Sear   3 Pasta and sauce   4 Serve   [ Ingredients ]      │
└─────────────────────────────────────────────────────────────────────┘

                  ┌──────────────────────────────────┐
                  │ STAGE 1 OF 4 · ABOUT 8 MIN       │
                  │                                  │
                  │ You'll need                      │
                  │ ...                              │
                  │                                  │
                  │ Heat the pasta water             │
                  │ ...                              │
                  └──────────────────────────────────┘
```

### Open desktop ingredient sheet

```text
┌──────────────────────────────────── page ───────────────────────────┐
│                                                        ┌───────────┤
│ Method remains visible beneath a quiet backdrop        │Ingredients│
│                                                        │ Serves 4  │
│                                                        │           │
│                                                        │Chicken    │
│                                                        │• Cutlets  │
│                                                        │• Flour    │
│                                                        │           │
│                                                        │Sauce      │
│                                                        │• Butter   │
│                                                        │• Lemon    │
│                                                        │           │
│                                                        │Equipment  │
│                                                        └───────────┤
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile page model

```text
Recipe hero

Ingredients
Compact single-column overview

┌────────────────────────────────────┐
│ stages scroll horizontally  [list] │  sticky
└────────────────────────────────────┘

Stage method
```

On mobile, the Ingredients control opens a bottom sheet rather than a narrow side drawer.

## Core Experience Behavior

### 1. Initial recipe view

When a recipe opens:

- The full ingredient overview appears in normal document flow.
- It is expanded by default.
- It is grouped by cooking purpose when curated groups exist.
- Legacy recipes with no curated grouping use one `Ingredients` group.
- Equipment appears as a quiet line or small footer beneath the list.
- Nothing in the overview is sticky.
- The stage navigator appears after the ingredient overview.

This makes the initial page useful for understanding the meal and gathering ingredients before entering the method.

### 2. Entering the method

Once the user scrolls beyond the ingredient overview:

- The stage navigator reaches its sticky position.
- The method occupies one centered reading column.
- Structured stages retain their compact `You'll need` list.
- Legacy stages omit `You'll need` because those mappings do not exist.
- The complete list is no longer visible unless the user scrolls back or opens the Ingredients control.

### 3. Opening ingredients on demand

The sticky stage navigator contains an `Ingredients` button.

Activating it should:

1. Preserve the current recipe and method scroll position.
2. Open an adaptive modal sheet.
3. Focus the sheet heading or close button.
4. Display the same ingredient content used in the initial overview.
5. Display equipment at the bottom.
6. Emphasize current-stage ingredients when structured mappings exist.

The page beneath the sheet should not scroll while the sheet is open.

### 4. Closing ingredients

The sheet should close when the user:

- Activates the close button.
- Presses `Escape`.
- Activates the backdrop, if pointer dismissal is supported.
- Selects an optional `Return to recipe` action on mobile.

After closing:

- Focus returns to the Ingredients trigger that opened it.
- The method remains at the exact previous scroll position.
- The active stage remains unchanged.

### 5. Navigating stages

Opening or closing ingredients must not interfere with stage navigation.

- The existing scroll-aware stage tracker remains the source of `aria-current="step"`.
- Clicking a stage closes the ingredient sheet first if a future version adds stage links inside the sheet.
- The active stage should be calculated from document position only when the sheet is closed.
- Opening the sheet freezes the active-stage context used for ingredient emphasis.

## Complete Ingredient Overview

### Visual treatment

The overview should feel like preparation reference material, not a second primary task area.

Recommended treatment:

- One outer surface with a single border.
- No card around each ingredient group.
- Group headings use restrained uppercase or small bold text.
- Ingredient rows use bullets and light dividers only when necessary.
- Quantities remain part of the ingredient string.
- Optional ingredients are slightly quieter but remain fully readable.
- Servings appear beside the main Ingredients heading.
- Equipment appears below a divider as a compact inline list.

### Responsive grouping

Use a group grid rather than CSS text columns so reading order remains predictable.

- **Large desktop:** Up to three group columns.
- **Small desktop/tablet:** Two group columns.
- **Mobile:** One column.

Each ingredient group stays intact when possible. A group should not be split between visual columns.

### Group-count guidance

Ingredient grouping is useful only when it reduces cognitive load.

Editorial guidance:

- Prefer two to four groups.
- Avoid creating a group for a single ordinary ingredient unless it represents a meaningful finish or option.
- Avoid awkward labels such as `For serving` when the ingredient is part of the core cooking process.
- Use stage-specific ingredient lists to communicate exact divisions rather than over-explaining them in group names.

Example Piccata grouping:

- `For the chicken`
- `For the pasta and sauce`
- `To finish`

### Equipment behavior

Equipment should appear:

- At the bottom of the initial ingredient overview.
- At the bottom of the on-demand ingredient sheet.
- Fully in print.

Equipment should not appear:

- As a persistent floating list.
- Repeated inside every structured stage.
- When the aggregated list contains only trivial tools filtered by the existing common-tool rules.

## Sticky Stage Navigator

### Layout

The navigator becomes a two-part control:

```text
┌───────────────────────────────────────────────┬──────────────┐
│ Stage list                                    │ Ingredients  │
└───────────────────────────────────────────────┴──────────────┘
```

Recommended structure:

```html
<nav class="recipe-stage-nav" aria-label="Recipe progress and reference">
  <ol class="recipe-stage-nav-list">
    <!-- stage buttons -->
  </ol>
  <button
    type="button"
    class="recipe-ingredients-trigger"
    aria-haspopup="dialog"
    aria-controls="recipeIngredientsDialog"
  >
    Ingredients
  </button>
</nav>
```

### Desktop behavior

- Stage buttons divide the available width.
- The Ingredients trigger remains visible at the right edge.
- The trigger does not scroll with the stage list.
- The trigger uses a list or pantry-style icon plus the text `Ingredients`.
- The trigger is visually secondary to the active stage.

### Mobile behavior

- Stage buttons remain horizontally scrollable.
- The Ingredients trigger remains pinned at the right edge.
- A subtle separator or shadow distinguishes it from the scrolling stage list.
- The button may use the shorter visible label `Ingredients` or an icon plus accessible text.
- The target must remain at least 44 by 44 CSS pixels.

## Ingredient Sheet

### Recommended primitive

Use a native `<dialog>` opened with `showModal()` unless browser support in the deployment environment requires a custom dialog.

Reasons:

- Native focus containment.
- Native `Escape` handling.
- Native top-layer rendering.
- A proper `::backdrop` surface.
- Less custom modal infrastructure.

The sheet should still include explicit focus restoration and scroll-lock handling because browser behavior can differ.

### Shared dialog content

The dialog must reuse the same rendering function as the initial overview.

Do not maintain two separately authored ingredient templates. A shared renderer should accept options such as:

```js
renderCompleteIngredients(recipe, {
  mode: "overview" | "sheet" | "print",
  activeStageId: "sear-chicken" | ""
});
```

The shared output should support:

- Grouped ingredient sections.
- Servings.
- Optional styling.
- Equipment.
- Ingredient IDs for current-stage emphasis.
- A current-stage context label in sheet mode.

### Desktop side sheet

At desktop widths:

- Position the sheet against the right side of the viewport.
- Use a width between approximately 380 and 440 pixels.
- Use the full viewport height or the height below the global site header.
- Keep the heading and close button sticky within the sheet.
- Scroll only the sheet body when its content is long.
- Use a restrained backdrop so recipe context remains perceptible.
- Do not shift the page horizontally when the dialog opens.

Suggested anatomy:

```text
Ingredients                         Close
Serves 4

Current stage: Sear the chicken

For the chicken
• 1½ lb cutlets
• 2 tbsp olive oil

For the pasta and sauce
• 12 oz pasta
...

Equipment
Large pot · Large skillet · Thermometer
```

### Mobile bottom sheet

At mobile widths:

- Anchor the dialog to the bottom of the viewport.
- Use a maximum height around 78 to 88 viewport height units.
- Round only the top corners.
- Include a visible drag-handle treatment only if it does not imply unsupported drag behavior.
- Keep the close button available; do not rely on swiping.
- Make the heading sticky inside the sheet.
- Respect safe-area insets.
- Keep ingredient rows large enough for comfortable reading without turning them into oversized tap targets.

### Backdrop behavior

- Use a low-opacity warm neutral backdrop rather than a heavy black overlay.
- Backdrop clicks may close the sheet, but the close button and `Escape` remain required.
- Pointer dismissal must not close the sheet when clicking inside its content.

## Enhancement: Current-Stage Ingredient Emphasis

### Purpose

The enhancement should make the complete list more useful when it is opened during cooking. It should answer:

> Which items in this complete list matter to the stage I am currently cooking?

### Structured recipe behavior

When the sheet opens from a structured recipe:

1. Read the active stage ID from the stage tracker.
2. Collect direct `ingredientId` values from that stage's `ingredientUses`.
3. Add a `data-current-stage-ingredient` state to matching rows in the complete list.
4. Show a quiet context line such as `For Stage 2: Sear the chicken`.
5. Give matching rows a restrained accent, marker, or slightly stronger type.
6. Leave all other ingredients fully readable.

Do not hide non-current ingredients.

### Prepared component behavior

Some stage uses refer to a prior stage rather than a raw ingredient:

```js
{ sourceStageId: "prep-sauce", display: "Prepared sauce" }
```

Do not trace this reference backward and highlight every raw ingredient used to create the component. Those raw ingredients are not being added again.

Instead, sheet mode may display a compact `Bring forward` line above the complete list:

```text
Bring forward: Prepared sauce from Stage 1
```

This line should come directly from the current stage's source-stage ingredient uses.

### Legacy recipe behavior

Legacy recipes have no curated stage-to-ingredient mapping.

For those recipes:

- Show the complete list normally.
- Do not infer or highlight current ingredients from instruction text.
- Do not show an empty current-stage label.
- Keep the sheet fully useful as a general reference.

### Visual rules for emphasis

- Use an accent rule, dot, or subtle background.
- Do not reduce non-current ingredients below accessible contrast.
- Do not reorder groups or ingredient rows.
- Do not add checkboxes.
- Do not animate every active-stage change.
- Calculate emphasis when the sheet opens; the page is scroll-locked while it remains open.

## Structured and Legacy Behavior Matrix

| Capability | Structured recipe | Legacy recipe |
|---|---:|---:|
| Complete overview before method | Yes | Yes |
| Sticky Ingredients trigger | Yes | Yes |
| Desktop side sheet | Yes | Yes |
| Mobile bottom sheet | Yes | Yes |
| Stage-specific inline ingredients | Yes | No |
| Current-stage ingredient emphasis | Yes | No |
| Prepared-component context | Yes | No |
| Equipment in overview/sheet | When available | When available |
| Complete print ingredients | Yes | Yes |

## State Model

The initial implementation needs lightweight transient UI state only.

Suggested state:

```js
let recipeIngredientsDialogOpen = false;
let recipeIngredientsTrigger = null;
let activeRecipeStageId = "";
```

No ingredient-panel state needs to be persisted to local storage.

### State transitions

#### Open

```text
Closed
  -> user activates Ingredients
  -> capture trigger and active stage
  -> prevent page scrolling
  -> render/apply stage emphasis
  -> show dialog
  -> focus close button or heading
  -> Open
```

#### Close

```text
Open
  -> close button, Escape, backdrop, or navigation
  -> close dialog
  -> restore page scrolling
  -> restore trigger focus
  -> clear transient trigger reference
  -> Closed
```

#### Recipe navigation while open

If the active recipe changes while the dialog is open:

- Close the dialog first.
- Clear dialog state.
- Render the new recipe.
- Do not restore focus into the old recipe DOM.

## Rendering Architecture

### Shared ingredient renderer

Extract the complete-list markup currently embedded inside `renderRecipeDetail()`.

Suggested functions:

```js
function renderCompleteIngredients(recipe, options = {}) {}
function renderIngredientGroups(groups, options = {}) {}
function renderRecipeEquipment(equipment) {}
function renderIngredientDialog(recipe, stages) {}
```

The same group and row functions should be used by both overview and dialog modes.

### Ingredient row contract

Every normalized complete ingredient row should expose its stable ID:

```html
<li data-recipe-ingredient-id="butter">
  <span>4 tbsp unsalted butter, divided</span>
</li>
```

Current-stage rows receive:

```html
<li
  data-recipe-ingredient-id="butter"
  data-current-stage-ingredient
>
```

This should be derived from existing normalized IDs, not from display-string matching.

### Stage contract

The stage tracker should store its current stage ID in one shared place when `setActiveRecipeStage()` runs.

Recommended behavior:

```js
function setActiveRecipeStage(stageId) {
  activeRecipeStageId = stageId;
  // Existing aria-current behavior.
}
```

The ingredient dialog reads that ID when it opens.

### Dialog placement

The dialog may be rendered:

- Once inside the active recipe article and replaced when recipes rerender, or
- Once at the application root with its inner content updated per recipe.

The preferred first implementation is one application-level dialog because:

- It avoids duplicate IDs.
- It survives recipe-body layout changes.
- Event handling is centralized.
- Modal cleanup is easier during navigation.

If using an application-level dialog, add the shell to `index.html` and populate its body from `app.js`.

### Proposed DOM shell

```html
<dialog id="recipeIngredientsDialog" class="recipe-ingredients-dialog">
  <div class="recipe-ingredients-dialog-shell">
    <header class="recipe-ingredients-dialog-header">
      <div>
        <h2 id="recipeIngredientsDialogTitle">Ingredients</h2>
        <p id="recipeIngredientsDialogContext"></p>
      </div>
      <button type="button" data-close-recipe-ingredients aria-label="Close ingredients">
        Close
      </button>
    </header>
    <div id="recipeIngredientsDialogBody" class="recipe-ingredients-dialog-body"></div>
  </div>
</dialog>
```

## CSS Architecture

Retire the current permanent-rail layout rather than layering new behavior on top of it.

### Remove or replace

- Sticky positioning from `.recipe-ingredients-panel`.
- Two-column method grid from `.recipe-detail-layout`.
- Left-rail width constraints.
- Print assumptions based on a 32/68 ingredient-method split.

### Add

- `.recipe-ingredient-overview`
- `.recipe-ingredient-overview-grid`
- `.recipe-stage-nav-list`
- `.recipe-ingredients-trigger`
- `.recipe-method-wrap` or centered `.recipe-method`
- `.recipe-ingredients-dialog`
- `.recipe-ingredients-dialog-shell`
- `.recipe-ingredients-dialog-header`
- `.recipe-ingredients-dialog-body`
- `[data-current-stage-ingredient]`
- `.recipe-stage-bring-forward`

### Recommended method width

The method should use a centered readable width rather than filling the space formerly shared with the rail.

- Target approximately 760 to 860 pixels on large screens.
- Preserve the current 60 to 70 character action-line length.
- Allow the containing method card to scale down fluidly.
- Do not create an empty decorative column.

### Motion

- Side-sheet entry may use a short transform transition.
- Bottom-sheet entry may use a short upward transition.
- Disable nonessential motion under `prefers-reduced-motion: reduce`.
- The sheet must remain fully functional without animation.

## Accessibility Requirements

### Dialog semantics

- Use native `<dialog>` with `showModal()` when possible.
- Give the dialog an accessible name through `aria-labelledby` or its visible heading.
- The trigger uses `aria-haspopup="dialog"` and `aria-controls`.
- `aria-expanded` may reflect open state, though it is optional for dialog triggers.
- Include a clearly labeled close button.

### Focus management

On open:

- Remember the exact trigger element.
- Focus the close button or dialog heading.
- Do not move focus to an ingredient row unless the user requested a specific ingredient.

On close:

- Restore focus to the original trigger if it still exists.
- If the recipe changed, focus the new recipe title instead.

### Keyboard behavior

- `Enter` and `Space` open from the trigger.
- `Escape` closes.
- `Tab` and `Shift+Tab` remain within the modal sheet.
- The close button is reachable immediately.
- Backdrop dismissal is never the only closing method.

### Screen-reader behavior

- Ingredient groups use headings and semantic lists.
- Current-stage emphasis is not communicated by color alone.
- Matching ingredients may include visually hidden text such as `Used in the current stage`.
- Do not announce scroll-driven stage changes continuously.
- Opening the dialog may expose a concise current-stage context line.
- Prepared components should be described as `From Stage 1`, not as newly added raw ingredients.

### Touch and visual accessibility

- Controls meet a minimum 44 by 44 target size on touch devices.
- Text maintains current readable sizes.
- The backdrop, drawer, focus indicators, and highlighted rows meet contrast requirements.
- Body-scroll locking must not cause the page to jump horizontally.
- Respect mobile safe-area insets.

## Print Behavior

Print should not reproduce the interactive drawer.

In print:

- Hide the sticky stage navigator.
- Hide the Ingredients trigger.
- Hide the dialog and backdrop.
- Print the initial complete ingredient overview in full.
- Print equipment with the complete list.
- Print every stage and action in order.
- Keep structured stage-specific ingredients if they remain compact.
- Avoid printing duplicated ingredient content from the dialog.
- Use a two-column print layout only when it improves legibility and does not split ingredient groups awkwardly.

## Responsive Behavior

### Large desktop

- Ingredient overview uses up to three group columns.
- Method is centered at a readable width.
- Ingredient reference opens as a right-side sheet.
- Stage list and Ingredients trigger share one sticky row.

### Tablet and small desktop

- Ingredient overview uses two columns.
- Method remains centered and nearly full width.
- Ingredient sheet may remain a side sheet if at least 360 pixels can fit comfortably.
- Otherwise switch to the bottom-sheet treatment.

### Mobile

- Ingredient overview uses one column.
- Stage list scrolls horizontally.
- Ingredients trigger remains pinned and does not scroll away.
- Reference opens as a bottom sheet.
- Dialog header and close control remain visible while sheet content scrolls.
- Sheet accounts for safe-area bottom padding.

### Very short viewports

- The sheet body, not the page, scrolls.
- The close button remains visible.
- Do not vertically center the sheet.
- Avoid fixed content that consumes most of the available height.

## Data Requirements

### Structured recipes

The enhancement relies on:

- Stable complete ingredient IDs.
- `stage.ingredientUses[].ingredientId` for direct ingredients.
- `stage.ingredientUses[].sourceStageId` for prepared components.
- Human-readable `display` text for prepared components.

No text matching should be used.

### Legacy recipes

Legacy recipes require only normalized complete ingredients.

Do not infer stage usage from instruction prose. Incorrect emphasis is worse than no emphasis.

### Validation rules

Add or retain automated checks that verify:

- Every structured direct `ingredientId` exists in the complete list.
- Every `sourceStageId` points to an earlier stage.
- Ingredient IDs remain unique after normalization.
- The dialog does not create duplicate DOM IDs.
- Recipes with no equipment omit the equipment section cleanly.
- Recipes with no structured stages omit current-stage emphasis cleanly.

## Interaction Edge Cases

The implementation must account for:

- Opening ingredients before any stage has crossed the sticky anchor.
- Opening ingredients at the final short stage.
- Changing viewport size while the sheet is open.
- Browser zoom at 200 percent.
- A recipe with one stage.
- A recipe with five or more stages and horizontal stage scrolling.
- Very long ingredient groups.
- No equipment.
- No stage ingredients.
- Optional ingredients.
- The same raw ingredient used in multiple stages.
- A divided ingredient whose stage displays differ.
- A stage containing only prepared components.
- Navigating to another recipe while the sheet is open.
- Printing while the interactive sheet is open.
- Reduced-motion mode.
- Back/forward browser navigation.

## Implementation Phases

### Phase 1: Structural layout change

#### Objective

Remove the permanent rail and create the shared complete ingredient overview.

#### Tasks

1. Extract complete ingredient markup from `renderRecipeDetail()` into a shared renderer.
2. Render the overview after the hero and before stage navigation.
3. Move equipment into the overview footer.
4. Remove sticky positioning from the ingredient panel.
5. Replace the two-column body with a centered method.
6. Add responsive group-grid styles.
7. Update print styles for the new document order.
8. Verify both structured and legacy recipes.

#### Acceptance criteria

- No complete ingredient list follows the user while scrolling.
- No empty left column appears beside later stages.
- Complete ingredients remain visible once before the method.
- Structured stage ingredients remain present.
- Legacy methods remain usable.
- Print includes one complete ingredient list.

### Phase 2: Persistent Ingredients access

#### Objective

Make the complete list available from every method scroll position.

#### Tasks

1. Add the Ingredients trigger to the sticky navigator.
2. Add the application-level dialog shell.
3. Populate dialog content from the shared ingredient renderer.
4. Implement `showModal()` and close behavior.
5. Restore trigger focus on close.
6. Lock and restore page scrolling safely.
7. Add desktop side-sheet styling.
8. Add mobile bottom-sheet styling.
9. Add reduced-motion styling.
10. Close and clean up the dialog during recipe navigation.

#### Acceptance criteria

- Ingredients are reachable at every method scroll position.
- Opening does not change the method scroll position.
- Closing returns focus correctly.
- `Escape` works.
- The page does not scroll behind the dialog.
- Desktop and mobile use the correct adaptive presentation.
- Structured and legacy recipes share identical access behavior.

### Phase 3: Current-stage emphasis enhancement

#### Objective

Connect the complete ingredient reference to the active structured stage.

#### Tasks

1. Store the active stage ID when the tracker updates.
2. Add stable ingredient IDs to overview and dialog rows.
3. Collect direct ingredient IDs from the active stage when opening.
4. Mark matching complete-list rows.
5. Add accessible current-stage text.
6. Render prepared-component `Bring forward` context without highlighting prior raw ingredients.
7. Omit the feature cleanly for legacy recipes.
8. Test ingredients reused across multiple stages.

#### Acceptance criteria

- Direct current-stage ingredients are visibly and semantically identifiable.
- Other ingredients remain readable.
- List order never changes.
- Prepared components are described accurately.
- Legacy recipes show no misleading inferred emphasis.

### Phase 4: Editorial and visual polish

#### Objective

Ensure the new overview remains calm and compact across the catalog.

#### Tasks

1. Review structured ingredient group names.
2. Reduce unnecessary one-item groups.
3. Correct misleading group labels such as `For serving` when needed.
4. Verify optional treatment.
5. Review equipment aggregation output.
6. Tune overview density against the longest recipes.
7. Tune drawer width and mobile height with real catalog examples.

#### Acceptance criteria

- Most structured recipes use two to four meaningful ingredient groups.
- The overview does not delay the method excessively.
- Group headings clarify rather than fragment the list.
- Equipment remains useful and concise.

## File-Level Implementation Map

### `app.js`

Expected changes:

- Extract complete ingredient rendering.
- Change `renderRecipeDetail()` document order.
- Remove the ingredient rail from `.recipe-detail-layout`.
- Add Ingredients trigger markup.
- Add dialog open, close, populate, and cleanup functions.
- Store the active stage ID.
- Compute current-stage direct ingredient IDs.
- Render prepared-component context.
- Close dialog during navigation and rerendering.
- Preserve existing stage scroll tracking.

Suggested helper names:

```js
renderCompleteIngredients()
renderRecipeEquipment()
openRecipeIngredients()
closeRecipeIngredients()
currentStageIngredientContext()
setRecipePageScrollLocked()
```

### `index.html`

Expected changes:

- Add one application-level ingredient dialog shell.
- Ensure script order remains unchanged unless a new module is introduced.

### `styles.css`

Expected changes:

- Replace rail/grid styles with overview and centered-method styles.
- Add stage-nav trigger layout.
- Add desktop side-sheet styles.
- Add mobile bottom-sheet styles.
- Add current-stage ingredient emphasis.
- Add backdrop, focus, reduced-motion, safe-area, and print rules.

### `data/recipe-prototypes.js`

Expected changes:

- No structural migration required for the core feature.
- Editorial group-name cleanup may be performed in Phase 4.
- Preserve stable ingredient and stage references.

### `data/recipe.schema.json`

Expected changes:

- None expected for the first implementation.
- Confirm existing schema covers `ingredientUses`, `ingredientId`, and `sourceStageId`.

## QA Plan

### Representative recipes

At minimum test:

1. Chicken Piccata: many ingredient groups, divided butter, optional wine, prepared components.
2. Hoisin Chicken Lettuce Cups: three stages and a short final stage.
3. Chicken Satay Rice Bowls: reused soy sauce/lime and prepared sauce.
4. Crispy Buffalo Chicken: long ingredient list, optional equipment branches.
5. Cacio e Pepe: small ingredient list and prepared pepper base.
6. One legacy stir-fry: no stage mappings.
7. One long legacy recipe.
8. One recipe with no meaningful equipment.

### Functional test matrix

| Test | Desktop | Tablet | Mobile | Keyboard | Print |
|---|---:|---:|---:|---:|---:|
| Complete overview visible once | Yes | Yes | Yes | N/A | Yes |
| Ingredient list is not sticky | Yes | Yes | Yes | N/A | N/A |
| Method centers without empty rail | Yes | Yes | Yes | N/A | Yes |
| Ingredients trigger remains reachable | Yes | Yes | Yes | Yes | Hidden |
| Dialog opens correctly | Side | Adaptive | Bottom | Yes | N/A |
| Escape closes | Yes | Yes | Yes | Yes | N/A |
| Focus restores | Yes | Yes | Yes | Yes | N/A |
| Scroll position preserved | Yes | Yes | Yes | Yes | N/A |
| Current-stage emphasis | Yes | Yes | Yes | Yes | N/A |
| Legacy recipe has no false emphasis | Yes | Yes | Yes | Yes | N/A |
| Equipment appears once per context | Yes | Yes | Yes | Yes | Yes |

### Scroll and tracker tests

- Open ingredients in Stage 1, close, and confirm Stage 1 remains active.
- Open ingredients in the final short stage and confirm final-stage emphasis.
- Click a different stage after closing and confirm the tracker updates.
- Scroll to the document bottom and confirm the last stage remains active.
- Resize while Stage 2 is active and confirm no stale geometry.
- Verify the Ingredients trigger does not obscure horizontally scrolling stage buttons.

### Accessibility tests

- Navigate from recipe title to ingredient overview with headings.
- Open the dialog using keyboard only.
- Confirm focus cannot escape the modal while open.
- Close with `Escape` and verify focus restoration.
- Confirm the dialog has a useful accessible name.
- Confirm current-stage ingredient meaning is available without color.
- Verify 200-percent zoom without content loss.
- Verify screen-reader list and heading structure.
- Verify reduced-motion behavior.

### Visual regression tests

Capture at least:

- Large desktop at the top of the ingredient overview.
- Large desktop midway through Stage 3 with the side sheet closed.
- Large desktop with the side sheet open.
- Tablet overview and adaptive sheet.
- Mobile overview.
- Mobile sticky stage navigation.
- Mobile bottom sheet.
- Legacy recipe method and sheet.
- Print preview.

## Performance Considerations

- Reuse normalized recipe data rather than reparsing display strings.
- Render dialog content on recipe open or first sheet open, not on every scroll event.
- Update only `aria-current` during stage scrolling.
- Compute ingredient emphasis once when the dialog opens.
- Avoid attaching row-level event listeners when event delegation is sufficient.
- Remove dialog and scroll listeners cleanly during navigation.

## Risks and Mitigations

### Risk: The overview delays access to the method

Mitigation:

- Use a compact responsive group grid.
- Keep group count under control.
- Allow the hero's `Start cooking` action to jump directly to the stage navigator.

### Risk: The Ingredients trigger makes the sticky navigator crowded

Mitigation:

- Keep the trigger pinned outside the horizontally scrolling stage list.
- Use a compact icon and label.
- Test five-stage recipes at narrow widths.

### Risk: Current-stage highlighting becomes misleading

Mitigation:

- Use only curated direct `ingredientId` references.
- Treat prepared components separately.
- Disable the feature for legacy recipes.

### Risk: The dialog duplicates ingredient-rendering logic

Mitigation:

- Require one shared renderer before building the dialog.
- Test overview and sheet content for exact row parity.

### Risk: Modal scroll locking causes page jumps

Mitigation:

- Preserve the current page position.
- Account for scrollbar width.
- Restore styles and scroll position on every close path.

### Risk: Native dialog behavior differs across browsers

Mitigation:

- Test supported browsers explicitly.
- Keep open/close state centralized.
- Add a small fallback only if the actual deployment matrix requires it.

## Definition of Done

This project is complete when:

1. The full ingredient list no longer follows the user down the method.
2. Every recipe shows one complete ingredient overview before its method.
3. The method no longer reserves an empty left column.
4. An Ingredients control remains available from the sticky navigator.
5. The control opens a desktop side sheet or mobile bottom sheet appropriately.
6. Opening and closing preserves scroll position and focus.
7. Structured recipes retain inline stage-specific ingredients.
8. Structured sheets identify current-stage direct ingredients.
9. Prepared components are represented without falsely highlighting their source ingredients.
10. Legacy recipes receive the overview and sheet without inferred stage mappings.
11. Equipment appears in the overview, sheet, and print without persistent duplication.
12. Keyboard, screen-reader, reduced-motion, zoom, and print behavior pass review.
13. The final short stage continues to activate correctly in the tracker.
14. All representative structured and legacy recipes pass the QA matrix.

## Recommended Delivery Order

Implement in this order:

1. Shared complete ingredient renderer.
2. Normal-flow ingredient overview.
3. Centered method layout.
4. Sticky Ingredients trigger.
5. Desktop side sheet and mobile bottom sheet.
6. Accessibility and lifecycle cleanup.
7. Current-stage emphasis enhancement.
8. Structured group-name editorial cleanup.
9. Responsive, browser, and print validation.

This order ensures the page becomes simpler before any new interaction is added, and it keeps the enhancement dependent on stable shared rendering rather than duplicated markup.
