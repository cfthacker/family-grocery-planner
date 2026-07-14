# Desktop Recipe Layout Execution Plan

## Status and purpose

This document is the source of truth for completing the desktop recipe-layout refinement. It converts the earlier diagnosis in `desktop-recipe-layout-preview-handoff.md` into an execution sequence with implementation boundaries, validation gates, and measurable acceptance criteria.

The working tree already contains an uncommitted prototype of several proposed changes in `app.js` and `styles.css`. Those edits are not automatically accepted. Execution begins by auditing them against this plan, preserving the parts that pass and revising or removing the parts that do not.

## Outcome

The completed recipe page should have one deliberate desktop reading axis below the hero:

```text
Wide editorial hero
        |
Centered complete ingredients (target: 920px)
        |
Centered stage progress (same width)
        |
Centered method (same width)
```

On desktop, ingredients should use two balanced, independent group stacks. The stage navigator should show progress only. Method prose should use the available card width without an arbitrary nested text column. Safety guidance should remain prominent enough to notice but read as contextual guidance rather than a system alert.

The existing narrow-screen behavior must remain intact: semantic one-column ingredient order, persistent Ingredients access, stage-aware ingredient highlighting, `Bring forward` context, and the native bottom sheet.

## Scope

### In scope

- Desktop content-width alignment.
- Complete-ingredient group balancing.
- Desktop versus narrow-screen Ingredients control behavior.
- Method line length and internal whitespace.
- Safety-note presentation.
- Responsive breakpoint behavior around 760/761px.
- Structured and legacy recipe compatibility.
- Sticky stage navigation, dialog interaction, and print regression testing.
- Focused automated checks for the balancing helper and rendered ingredient counts if the project test setup permits them without introducing a large framework.

### Out of scope

- Redesigning the wide recipe hero.
- Changing recipe content, quantities, stage order, or ingredient data.
- Inferring stage ingredients for legacy recipes.
- Reintroducing a persistent desktop ingredient rail.
- Replacing the native `<dialog>` unless browser validation exposes an unfixable platform problem.
- General planner, grocery, pantry, or catalog redesign.
- Broad visual-system changes unrelated to the recipe detail page.

## Files expected to change

- `app.js`
  - Ingredient-group balancing helper.
  - Complete-ingredient rendering structure.
  - Only minimal interaction changes if browser tests reveal a dialog or stage-tracker defect.
- `styles.css`
  - Shared recipe width token.
  - Balanced-stack layout.
  - Narrow linear-layout fallback.
  - Desktop trigger visibility.
  - Method prose and safety-note styling.
  - Print safeguards.
- `docs/desktop-recipe-layout-execution-plan.md`
  - Record final decisions, deviations, and validation results.

No recipe-data file should change unless validation proves that a recipe currently violates its existing schema or references a nonexistent ingredient. Layout problems must not be solved by rewriting recipe content.

## Non-negotiable design rules

1. The ingredient overview, stage navigator, and method share the same centered width on desktop.
2. Ingredient groups may move between desktop columns but may not be split.
3. Narrow and assistive reading order remains the original recipe group order.
4. Equipment renders once, below the complete ingredient groups.
5. The desktop stage navigator contains stage progress only.
6. Narrow layouts retain the Ingredients trigger and ingredient sheet.
7. Structured recipes highlight only explicit direct ingredient references.
8. Prepared components remain separate `Bring forward` context.
9. Legacy recipes receive no guessed ingredient highlighting.
10. Method readability is controlled by the shared outer width and padding, not by another arbitrary paragraph maximum.
11. Reducing a safety note's visual weight must not weaken its wording or remove it from the relevant stage.
12. No phase is complete until its browser validation gate passes.

## Phase 0 — Protect the baseline and audit the prototype

### Actions

1. Record `git status --short` and identify all pre-existing modified and untracked files.
2. Do not reset, reformat, or overwrite unrelated working-tree changes.
3. Review the focused diff in `app.js` and `styles.css` for:
   - the shared width token;
   - duplicate ingredient markup;
   - balancing-helper behavior;
   - breakpoint placement in the CSS cascade;
   - dialog isolation;
   - print behavior.
4. Start the local app from `D:\Projects\family-grocery-planner` and connect the in-app Browser.
5. Open Chicken Piccata at 1440 × 900 and capture the current prototype as the comparison baseline.
6. Check the browser console before changing code.

### Gate

- The preview reloads reliably.
- The direct recipe route resolves correctly.
- Images, scripts, and styles load without browser errors.
- Existing unrelated working-tree changes are documented and untouched.

## Phase 1 — Establish a single desktop content axis

### Implementation

Define one local token on `.recipe-detail-article`:

```css
.recipe-detail-article {
  --recipe-content-width: 920px;
}
```

Apply the same rule to:

- `.recipe-ingredient-overview`
- `.recipe-stage-nav`
- `.recipe-method`

```css
width: min(100%, var(--recipe-content-width));
margin-inline: auto;
```

Keep the hero wide. Remove any old method-only maximum that competes with the shared token.

### Width decision procedure

Start at 920px. Compare 900px and 880px only if either of these is true at 1440px:

- Buffalo's longest branch instruction becomes uncomfortable to scan.
- Piccata's method still feels visually hollow despite removing the paragraph cap.

Use 940px only if 920px visibly crowds the stage navigation or ingredient strings without improving reading. The final width must be one value shared by all three layers.

### Gate

At 1440 × 900 and 1280 × 800:

- the three bounding widths are equal;
- their left and right edges align;
- no horizontal overflow appears;
- the hero remains intentionally wider;
- the transition from hero to ingredients reads as a hierarchy, not an accidental funnel.

## Phase 2 — Implement deterministic balanced ingredient stacks

### Balancing algorithm

For each complete ingredient group:

1. Record the original group index.
2. Estimate weight as `ingredient count + 1` for the heading.
3. Sort candidates by descending weight, using original index as the tie-breaker.
4. Assign each candidate to the currently lighter of two columns.
5. Sort groups inside each column by original index.
6. Put the column containing the earliest original group first.

This makes the output deterministic and preserves familiar ordering where possible.

### Renderer structure

Create one small renderer for a single ingredient group so the row markup is not duplicated by hand. Use it for:

- the balanced desktop overview;
- the semantic linear overview;
- the ingredient sheet.

The desktop overview can contain a balanced representation plus a linear representation only if CSS guarantees that exactly one is exposed and rendered at a time. Verify that `display: none` removes the inactive representation from the accessibility tree. If that cannot be established reliably, prefer a single DOM representation with an accessible ordering strategy rather than leaving duplicate accessible content.

### Layout behavior

- Above the narrow breakpoint: two independent column containers.
- At and below the narrow breakpoint: one linear container in original group order.
- Dialog: always one linear container in original group order.
- A legacy recipe with one group: retain the compact multi-column ingredient-list treatment on desktop if readable; do not create an empty second stack.
- Equipment: render once below the chosen group container.

### Initial balance targets

| Recipe | Left stack | Right stack |
| --- | --- | --- |
| Hoisin lettuce cups | Filling; Optional toppings | Sauce; Assembly |
| Chicken Piccata | Chicken; Finish | Pasta and sauce |
| Chicken Satay bowls | Chicken; Marinade and peanut sauce | Rice and slaw; Finish |
| Crispy Buffalo chicken | Crispy chicken | Salad and broccoli; Buffalo sauce; Finish |
| Cacio e Pepe | Sauce | Pasta; Serving |

The exact left/right placement may vary only when the deterministic algorithm produces a comparably balanced result and preserves the earliest group in the first column.

### Adjustment rule

Do not add string-length heuristics after inspecting only one recipe. Add wrap-aware weight only if at least two recipes show a repeatable mismatch of more than roughly two rendered text rows between columns. If needed, add a small deterministic penalty for long ingredient display strings and cover it with helper tests.

### Gate

- No ingredient group is split.
- Each complete ingredient appears exactly once in the active overview.
- Equipment appears exactly once.
- Desktop uses two visibly balanced stacks for all five structured recipes.
- Cacio does not look overbuilt despite its short list.
- Buffalo does not leave a large empty column.
- Piccata has no mostly empty third column.
- At 760px and below, headings return to original semantic order.

## Phase 3 — Separate progress from ingredient lookup

### Implementation

Use 761px as the initial intent breakpoint:

```css
@media (min-width: 761px) {
  .recipe-ingredients-trigger { display: none; }
  .recipe-stage-nav { grid-template-columns: 1fr; }
}
```

At 760px and below:

- retain the Ingredients trigger;
- retain the horizontally scrollable stage list;
- keep the trigger icon-only where existing mobile styling calls for it;
- preserve its accessible name and 44px target.

### Breakpoint decision procedure

Inspect 820px, 761px, 760px, and 720px. Change the breakpoint only if the stage list is visibly cramped before the trigger appears or remains needlessly mobile after ample space returns. If changed, update every related layout rule together; do not create mismatched trigger, navigation, and ingredient-column breakpoints.

### Legacy decision

Test at least two legacy recipes, including one with a long method. Keep the desktop trigger removed unless real use demonstrates an ingredient lookup problem. If legacy desktop access is necessary, design a legacy-only action outside the progress navigator; do not mix it back into stage progress for every recipe.

### Gate

- Desktop tracker has no Ingredients action or empty grid column.
- Narrow tracker remains usable and does not cause page overflow.
- The trigger has a correct accessible name when its visible label is clipped.
- Structured and legacy recipes both retain a complete overview directly above the method.

## Phase 4 — Let method prose use the method card

### Implementation

Remove the paragraph-level `max-width: 68ch` and use:

```css
.recipe-step-list p {
  max-width: none;
}
```

Tune only the shared content width or `.recipe-method` padding if lines are too long. Do not introduce a second independent text-column width.

### Recipes to inspect

- Piccata: confirms the accidental blank region is gone.
- Buffalo: longest oven, sheet-pan, and air-fryer branches.
- Satay: long cooking instructions plus dense stage support.
- Cacio: confirms short stages do not look lost in an oversized card.

### Gate

- Paragraphs use the visible card width naturally.
- Action headings, ingredient support, notes, and paragraphs align consistently.
- Long branches are shorter vertically without becoming tiring to scan.
- No recipe develops excessively long desktop lines.

## Phase 5 — Refine safety and contextual annotations

### Safety treatment

Use a content-sized annotation with:

- no full rectangular border;
- a 2px left apricot accent;
- a subtle or transparent background;
- `width: fit-content` with a modest maximum;
- the existing safety label and complete wording.

The note should align with the action text and remain easy to find when scanning Stage 1.

### Context hierarchy

- `Family flex`: inline near the relevant decision.
- `Ready when`: quiet stage footer.
- `You'll need`: compact support strip.
- Safety: noticeable contextual annotation.
- Stage actions: dominant reading path.

### Gate

- Piccata's safety note is materially narrower than the method interior when content permits.
- The note remains readable at 390px without clipping.
- Family flex and Ready when are not visually strengthened by collateral CSS changes.
- Safety wording is unchanged.

## Phase 6 — Static and deterministic validation

Run after implementation and before final browser sign-off:

1. JavaScript syntax validation using an available runtime or browser parse check.
2. Recipe schema parsing.
3. CSS brace-count sanity check.
4. `git diff --check`.
5. Structured data integrity checks:
   - unique stage and action IDs;
   - valid direct ingredient references;
   - valid earlier-stage prepared-component references;
   - no unused complete-list ingredient in structured recipes.
6. Rendering checks:
   - overview and sheet have equal complete ingredient row counts;
   - linear overview group order matches recipe data;
   - single-group legacy output creates no empty balanced column;
   - balancing output is deterministic for the five structured recipes.

If a focused test file can run with the existing environment, add small tests for the balancing helper. Do not introduce a large test framework solely for this helper.

## Phase 7 — Responsive visual validation

### Required viewports

| Viewport | Purpose |
| --- | --- |
| 1440 × 900 | Large desktop composition and line length |
| 1280 × 800 | Common desktop |
| 1024 × 768 | Small desktop / landscape tablet |
| 820 × 1180 | Portrait tablet above the breakpoint |
| 761 × 900 | First desktop-intent pixel |
| 760 × 900 | Narrow-intent boundary |
| 520 × 900 | Narrow web |
| 390 × 844 | Mobile |

At every viewport check:

- page-level horizontal overflow;
- hero and content transition;
- overview, navigator, and method widths;
- ingredient group layout and ordering;
- stage navigation usability;
- sticky position below the global header;
- method line length;
- safety-note hierarchy;
- dialog trigger visibility as appropriate.

### Required recipe routes

```text
/#recipe/asian-chicken-lettuce-cups-with-rice
/#recipe/chicken-piccata
/#recipe/chicken-satay-rice-bowls
/#recipe/crispy-buffalo-chicken-with-side-salad-and-broccoli
/#recipe/cacio-e-pepe-with-caesar-salad-kit
/#recipe/beef-tacos-with-yellow-rice
```

Use Piccata at every viewport. Use all five structured recipes at 1440px and 390px. Use Beef Tacos plus one additional legacy recipe at desktop and mobile.

## Phase 8 — Interaction validation

### Stage tracker

For Piccata and Buffalo:

1. Click each stage control and confirm the target heading lands below the sticky layers.
2. Slowly scroll across stage boundaries and confirm `aria-current` changes once and remains stable.
3. Scroll to the true document bottom and confirm the final stage becomes current.
4. At 760px and 390px, confirm the active stage remains reachable in the horizontal navigator.

### Ingredient sheet

At 760px and 390px:

1. Open the sheet during every Piccata stage.
2. Confirm only direct current-stage ingredients are emphasized.
3. Confirm prepared components appear under `Bring forward`.
4. Close with the close button.
5. Close with Escape.
6. Close by clicking the backdrop.
7. Confirm body scroll locks while open and restores after close.
8. Confirm the trigger regains focus.
9. Confirm repeated open/close cycles do not accumulate body padding or shift layout.

For a legacy recipe, confirm the sheet shows no current-stage highlighting and uses complete-recipe context.

### Gate

All interaction paths pass in the real browser. A mocked event result alone is insufficient for final acceptance.

## Phase 9 — Print validation

Use browser print preview for Piccata and Buffalo, once normally and once after opening the ingredient dialog.

Confirm:

- the complete ingredient overview prints exactly once;
- the inactive linear or balanced duplicate does not print;
- the stage navigator and Ingredients trigger do not print;
- the dialog and backdrop do not print;
- ingredient groups do not split awkwardly;
- stage headings stay with their first action where practical;
- safety and contextual annotations remain legible in grayscale;
- no clipped text or blank dialog page appears.

If the browser cannot automate print preview, record manual verification as an explicit remaining step rather than marking print complete.

## Phase 10 — Regression review and handoff

1. Re-run static checks after the final CSS adjustment.
2. Review the focused diff for accidental recipe-data or unrelated UI changes.
3. Compare final screenshots with the Phase 0 prototype baseline.
4. Record the chosen width and breakpoint in this document.
5. Record every acceptance criterion as pass, fail, or manual follow-up.
6. Do not stage or commit unless explicitly requested.

## Screenshot evidence set

Capture and retain:

1. Piccata desktop overview and shared alignment.
2. Piccata Stage 1 with safety annotation.
3. Hoisin desktop ingredient balance.
4. Satay dense stage support.
5. Buffalo ingredient balance and longest instruction branch.
6. Cacio compact overview.
7. Piccata at 761px and 760px.
8. Piccata mobile overview and stage navigator.
9. Piccata mobile ingredient sheet with current-stage highlighting.
10. Piccata later-stage sheet with `Bring forward` context.
11. Legacy recipe desktop and mobile.
12. Structured recipe print preview.

## Acceptance checklist

The work is complete only when every applicable item passes:

- [ ] Overview, navigator, and method share one centered desktop width.
- [ ] The hero remains intentionally wider.
- [ ] All structured overview groups form two balanced desktop stacks.
- [ ] No group is split and no ingredient is duplicated in the active presentation.
- [ ] Narrow overview order matches the recipe's semantic group order.
- [ ] Equipment appears exactly once.
- [ ] Desktop navigator contains progress only.
- [ ] Narrow layouts retain accessible Ingredients access.
- [ ] Method prose has no arbitrary inner maximum.
- [ ] Piccata safety guidance reads as a compact annotation without losing prominence.
- [ ] Family flex, Ready when, and You'll need remain subordinate to actions.
- [ ] All five structured recipes pass desktop and mobile review.
- [ ] At least two legacy recipes remain usable without inferred stage ingredients.
- [ ] Sticky offsets and final-stage activation pass.
- [ ] Close button, Escape, backdrop, scroll lock, and focus restoration pass.
- [ ] No tested viewport has page-level horizontal overflow.
- [ ] Print contains one ingredient overview and no interactive sheet or navigator.
- [ ] Browser console is free of new errors.
- [ ] Static validation and `git diff --check` pass.
- [ ] Unrelated working-tree changes remain untouched.

## Failure and rollback rules

- If 920px makes two or more recipes difficult to read, change the single shared token; do not add recipe-specific widths.
- If item-count balancing repeatedly fails because of wrapping, improve the deterministic weight function; do not hand-code recipe IDs into layout logic.
- If duplicate overview representations leak into accessibility or print, replace the dual representation before proceeding.
- If the 760/761 breakpoint causes cramped stages, move the full responsive behavior as one unit.
- If legacy desktop lookup becomes genuinely difficult, add a legacy-only reference affordance outside stage progress.
- If a change regresses mobile dialog behavior, revert that focused change while retaining independent desktop improvements.
- Never use a destructive Git reset to recover; apply a focused patch that preserves unrelated work.

## Initial implementation decisions to verify

The current prototype uses:

- shared width: `920px`;
- breakpoint: `761px` desktop / `760px` narrow;
- balance estimate: item count plus one heading unit;
- safety maximum: `72ch` with content-sized width;
- full method paragraph width.

These are starting decisions, not immutable requirements. They become final only after the gates above pass.

## Execution record — 2026-07-12

### Final decisions

- Shared desktop content width: `920px`.
- Responsive intent boundary: desktop at `761px` and above; narrow behavior at `760px` and below.
- Ingredient balancing: item count plus one heading unit, deterministic shortest-column assignment.
- Structured component order: explicit authored `ingredientComponentOrder` metadata.
- Method prose: no inner maximum width.
- Safety annotation: content-sized with a `72ch` ceiling and left accent.
- Print: balanced overview forced on, semantic duplicate hidden, dialog-open body lock neutralized.

### Implementation deviations discovered during execution

1. Hoisin's first-use ordering did not match the approved authored ingredient order. Explicit component-order metadata was added for all five structured recipes so ordering remains general and deterministic rather than recipe-ID-specific.
2. Smooth mobile stage scrolling allowed the observer to overwrite a clicked stage before the ingredient sheet opened. A temporary target-aware tracker guard now holds the clicked stage until the target reaches the reading anchor or document bottom.
3. Opening the ingredient dialog at the final stage changed the document-bottom calculation and could fall back to the prior stage. Background stage tracking now pauses while the modal is open.
4. Native Escape dismissal was unreliable in the in-app browser. The dialog now handles Escape explicitly through the standard close path.
5. Print CSS now explicitly removes screen scroll locking, prints only the balanced overview representation, prevents ingredient-group splitting, and lets a legacy single group span the print grid.

### Automated validation results

- PASS — 56 responsive route/viewport combinations: five structured recipes plus two legacy recipes at all eight required viewport sizes.
- PASS — equal overview, navigator, and method widths at every tested viewport.
- PASS — no page-level horizontal overflow in the responsive matrix.
- PASS — all five structured recipes match their planned semantic group order and desktop stack assignment.
- PASS — active overview contains one instance of every ingredient; hidden semantic representation has zero layout dimensions on desktop.
- PASS — overview and ingredient-sheet row counts match for every structured recipe.
- PASS — both legacy recipes render without balanced-stack duplication; legacy sheet has zero current-stage markers.
- PASS — all Piccata stage controls update `aria-current`, focus their heading, and land below the sticky tracker.
- PASS — final Piccata stage becomes current at the true document bottom.
- PASS — every Piccata mobile stage opens the sheet with the correct context, direct ingredient markers, and `Bring forward` content.
- PASS — close button, Escape, and backdrop dismissal.
- PASS — body scroll lock, padding cleanup, `aria-expanded`, and trigger focus restoration.
- PASS — structured recipe IDs, stage IDs, action IDs, direct ingredient references, earlier-stage references, and component-order coverage.
- PASS — browser parsing with no console errors.
- PASS — recipe schema JSON parsing, CSS brace balance, and `git diff --check`.
- PASS — parsed print CSS contains the required dialog, duplicate-content, group-break, and body-unlock safeguards.

### Manual follow-up

- MANUAL — open native browser print preview for Piccata and Buffalo and visually confirm pagination and grayscale appearance. The in-app browser automation surface does not expose native print-preview pages. Static print behavior and parsed print rules pass.

## Post-execution refinement — latest product feedback

The earlier stage navigator and mobile ingredient sheet were superseded after visual review. The current implementation now uses these decisions:

- No floating or sticky recipe-stage navigator.
- No persistent Ingredients shortcut and no ingredient dialog.
- Each method stage has a visible numbered title row with the highlighted treatment applied permanently.
- Stage scroll tracking was removed because the persistent treatment provides sufficient differentiation without changing state.
- The ingredient overview starts collapsed with four representative items and an item count.
- One full-width disclosure control forms the footer of the ingredient card and reports the number of hidden items; it becomes `Show less` when expanded.
- Salt, pepper, cooking spray, and everyday oils are separated into a quiet Pantry staples section.
- Pantry staples are omitted from stage-level You'll need lists.
- Ready when guidance is rendered inside the relevant final action instead of as a stage footer.
- One compact Family flexibility strip appears between ingredients and method without an additional card headline, preserving the original hero height.
- Contextual stage-level family callouts were removed to avoid repeating the hero guidance.
- Add and Print share one aligned action row with equal height; Add remains the flexible primary action while Print uses a stable secondary width on desktop and an equal column on mobile.

Validation for this refinement covered five structured recipes and two legacy recipes at 1440px, 820px, and 390px. All 21 route/viewport combinations passed overflow, collapsed-state, visible-stage-title, permanent-highlight, disclosure-placement, family-strip, and simplified-method-heading checks. Expand/collapse behavior, pantry separation, inline readiness cues, and print disclosure overrides also passed.
