# Desktop Recipe Layout and Preview Restart Handoff

## Purpose

This document records:

1. The desktop recipe-layout problems identified after implementing the ingredient overview and mobile ingredient sheet.
2. The exact desktop refinements that should be made next.
3. How those refinements apply to all five structured recipes.
4. What has and has not been verified without a working live preview connection.
5. The setup and validation sequence to run after restarting Codex.

The goal is to let a restarted Codex session continue without reconstructing the design decisions or browser diagnosis from chat history.

## Workspace

- **Project root:** `D:\Projects\family-grocery-planner`
- **Primary page:** `index.html`
- **Primary implementation files:**
  - `app.js`
  - `styles.css`
  - `index.html`
  - `data/recipe-prototypes.js`
- **Existing detailed plan:** `docs/recipe-ingredient-access-plan.md`

## Current Implementation State

The following work has already been implemented:

- Recipe cards can open a full recipe detail page.
- Five recipes use structured stages, stage ingredients, action leads, and curated recipe data.
- Legacy recipes use generated stage groupings as a fallback.
- Complete ingredients appear once before the method rather than remaining in a sticky left rail.
- The method is centered beneath the complete ingredient overview.
- Mobile and narrow layouts include a persistent Ingredients control.
- That control opens an ingredient reference sheet.
- Structured recipes emphasize direct ingredients for the current stage in the sheet.
- Prepared components are shown separately as `Bring forward` context.
- Legacy recipes do not receive guessed ingredient highlighting.
- The final short stage can become active in the scroll tracker.
- Print uses the complete ingredient overview and hides interactive controls.

The mobile/narrow experience is directionally successful. The remaining concerns are primarily full-desktop composition and visual validation.

## Desktop Problems Observed

## 1. The page uses competing content widths

The current desktop hierarchy uses several widths:

- The hero uses almost the complete page width.
- The ingredient overview uses the complete page width.
- The sticky stage navigator uses the complete page width.
- The method is narrower and centered.
- Individual method paragraphs are narrower again because of a `max-width: 68ch` rule.

This creates a funnel effect in which each successive layer appears less connected to the one above it.

### Result

- Ingredients feel detached from the method.
- The stage navigator looks wider than the content it controls.
- Instructions wrap before reaching the visible right side of their card.
- The method contains a conspicuous unused region.

## 2. The ingredient overview is mathematically even but visually unbalanced

The current overview uses equal-width group columns. Equal column widths do not account for unequal group sizes.

Chicken Piccata demonstrates the problem:

- `For the chicken`: 4 items
- `For the pasta and sauce`: 7 items
- `To finish`: 1 item

The third column is mostly empty while the middle column is substantially taller.

This issue recurs in different proportions across all five structured recipes.

## 3. The desktop Ingredients control is redundant

The Ingredients control currently appears inside the sticky stage navigator on desktop.

This is awkward because:

- The complete ingredient overview is immediately above the navigator.
- Structured stages already repeat the ingredients needed for the current stage.
- Ingredient lookup is not stage progress.
- The utility button adds a second visual purpose to a control that should primarily communicate location in the recipe.

The control is useful on mobile because the complete list may be far away and space is constrained. It does not earn its place in the full desktop navigator.

## 4. Method text wraps at an arbitrary inner limit

The method card is already constrained to a readable width, but `.recipe-step-list p` also uses `max-width: 68ch`.

This creates an additional artificial text column inside the card.

### Result

- Action text wraps while a large unused area remains beside it.
- The whitespace looks accidental rather than editorial.
- Longer branch instructions become unnecessarily tall.
- The relationship between action titles, stage ingredients, and notes becomes uneven.

## 5. Safety guidance stretches like a system alert

The Piccata safety note spans nearly the complete inner width of the method card and uses a complete bordered rectangle.

The content is important but contextual. It should behave like an annotation attached to the raw-chicken workflow, not like a page-wide warning banner.

## Target Desktop Composition

Everything below the hero should share one centered width.

Recommended target:

```text
Recipe hero:                existing wide editorial treatment

Ingredient overview:        900–920px centered
Stage navigator:            900–920px centered
Method:                     900–920px centered
Action paragraphs:          full available method width
```

The exact value should be chosen through live preview comparison. Start with `920px` and test `880px`, `900px`, and `940px` if needed.

## Planned Desktop Changes

## 1. Introduce one shared recipe content-width variable

Define a reusable width token rather than repeating unrelated maximum widths.

Suggested direction:

```css
.recipe-detail-article {
  --recipe-content-width: 920px;
}
```

Apply it to:

- `.recipe-ingredient-overview`
- `.recipe-stage-nav`
- `.recipe-method`

Each should use:

```css
width: min(100%, var(--recipe-content-width));
margin-inline: auto;
```

Do not constrain the hero to this width unless live inspection shows that the transition from hero to content remains too abrupt.

## 2. Replace the basic ingredient grid with balanced column stacks

A standard CSS grid creates row-aligned empty space. Instead, render two independent vertical columns on full desktop.

Target structure:

```html
<div class="recipe-ingredient-columns">
  <div class="recipe-ingredient-column">
    <!-- assigned ingredient groups -->
  </div>
  <div class="recipe-ingredient-column">
    <!-- assigned ingredient groups -->
  </div>
</div>
```

### Balancing algorithm

For each complete ingredient group:

1. Estimate visual weight as `ingredient count + 1` for the group heading.
2. Sort groups from greatest weight to least weight.
3. Assign the next group to the currently shorter column.
4. Preserve original relative order within each resulting column where practical.
5. Render equipment once below both columns.

Do not split a group between columns.

### Why this is preferable to CSS columns

- DOM and screen-reader order remain explicit.
- Groups never split unexpectedly.
- Layout does not depend on browser column-balancing behavior.
- The renderer can be tested deterministically.
- Mobile can return to one linear column cleanly.

### Tablet and mobile behavior

- Desktop: two balanced stacks.
- Tablet: two stacks if the content remains comfortable.
- Mobile/slim web: one linear column in semantic order.
- The ingredient sheet remains one linear column.

## 3. Remove the desktop Ingredients button

The Ingredients button and sheet should remain available only on mobile or sufficiently narrow layouts.

Recommended breakpoint to test first:

```css
@media (min-width: 761px) {
  .recipe-ingredients-trigger {
    display: none;
  }

  .recipe-stage-nav {
    grid-template-columns: 1fr;
  }
}
```

The final breakpoint should follow the point at which the mobile/narrow stage navigator begins horizontally scrolling, not an arbitrary device category.

### Desktop accessibility consequence

Removing the button is acceptable for structured recipes because:

- The full ingredient overview appears immediately before the method.
- Every stage provides a current working ingredient subset.
- Prepared components are named in stage-specific lists.

Legacy recipes should be checked separately because they do not have stage-specific ingredient subsets. If live testing shows a genuine lookup problem, consider a legacy-only desktop reference action outside the stage navigator rather than restoring the button universally.

## 4. Let method prose use the method card

Remove the paragraph-level `max-width: 68ch` restriction on desktop.

The outer method width and inner padding should control readability.

Target behavior:

```css
.recipe-step-list p {
  max-width: none;
}
```

Then tune the shared content width and method padding through preview rather than adding a second nested text constraint.

### Concern to verify

If `920px` produces uncomfortably long text lines, reduce the shared width or slightly increase method padding. Do not reintroduce a visibly arbitrary paragraph width.

## 5. Convert safety guidance to a compact annotation

Safety guidance should use:

- A left accent rule.
- Little or no filled background.
- No complete rectangular border for routine cleanup guidance.
- A content-sized or modestly constrained width.
- Alignment with the action text above it.

Suggested direction:

```css
.recipe-stage-note.tone-safety {
  width: fit-content;
  max-width: 72ch;
  border: 0;
  border-left: 2px solid var(--apricot-dark);
  background: rgba(...);
}
```

A full-width bordered warning should be reserved for guidance that genuinely blocks progression or communicates immediate danger.

## 6. Keep other contextual treatments subordinate

Across desktop recipes:

- `Family flex` remains an inline annotation near its decision point.
- `Ready when` remains a quiet stage footer.
- `You'll need` remains a compact two-column strip.
- Stage actions remain the dominant reading path.

Do not solve the desktop problem by adding more cards or stronger backgrounds.

## Structured Recipe Fit Check

## 1. Hoisin Chicken Lettuce Cups with Rice

Ingredient groups:

- Filling: 7 items
- Sauce: 4 items
- Assembly: 3 items
- Optional toppings: 1 item

Balanced target:

```text
Column A                       Column B
For the filling               For the sauce
Optional toppings             To assemble
```

Approximate weight: 8 versus 7 ingredient rows.

### Method considerations

- Three stages.
- Stage 2 has four actions and eight stage ingredient uses.
- Full-width method prose should reduce unnecessary wrapping.
- Family guidance is short and should remain inline.

### Expected result

The planned desktop treatment should work well.

## 2. Chicken Piccata

Ingredient groups:

- Chicken: 4 items
- Pasta and sauce: 7 items
- Finish: 1 item

Balanced target:

```text
Column A                       Column B
For the chicken               For the pasta and sauce
To finish
```

Approximate weight: 5 versus 7 ingredient rows.

### Method considerations

- Four stages.
- The current safety annotation is the main contextual-layout problem.
- Removing the paragraph `68ch` limit should eliminate the marked empty method region.

### Expected result

This is the primary desktop reference recipe for the next iteration.

## 3. Chicken Satay Rice Bowls

Ingredient groups:

- Rice and slaw: 6 items
- Chicken: 5 items
- Marinade and peanut sauce: 4 items
- Finish: 1 item

Balanced target:

```text
Column A                       Column B
For the chicken               For the rice and slaw
Marinade and peanut sauce     To finish
```

Approximate weight: 9 versus 7 ingredient rows.

### Method considerations

- Four stages.
- Stage 2 contains eleven ingredient uses and is the densest `You'll need` test.
- The chicken cooking instruction is long and should benefit materially from full-width method prose.

### Expected result

This is the best density stress test for the stage ingredient strip.

## 4. Crispy Buffalo Chicken

Ingredient groups:

- Crispy chicken: 10 items
- Salad and broccoli: 5 items
- Buffalo sauce: 2 items
- Finish: 1 item

Balanced target:

```text
Column A                       Column B
For the crispy chicken        For the salad and broccoli
                               For the buffalo sauce
                               To finish
```

Approximate weight: 10 versus 8 ingredient rows.

### Method considerations

- Three stages.
- Contains long oven, sheet-pan, and air-fryer branch instructions.
- Includes one meaningful `Ready when` cue.
- Tests whether wider prose becomes too long rather than merely less wrapped.

### Expected result

This is the strongest overall stress test for the balanced ingredient columns and method width.

## 5. Cacio e Pepe with Caesar Salad Kit

Ingredient groups:

- Sauce: 4 items
- Pasta: 2 items
- Serving: 1 item

Balanced target:

```text
Column A                       Column B
For the sauce                 For the pasta
                               For serving
```

Approximate weight: 4 versus 3 ingredient rows.

### Method considerations

- Four short stages.
- Small complete ingredient list.
- Tests whether the shared ingredient card feels overly large for a simple recipe.
- Tests whether the stage navigator feels too prominent when stages are short.

### Expected result

The plan should work, but the ingredient overview padding may need a compact variant for very short lists.

## Concerns Caused by the Missing Live Preview

Static validation can prove data and syntax consistency. It cannot prove that the page feels balanced.

## 1. CSS cascade and breakpoint interaction

Without rendering, there is a risk that:

- Desktop rules are overridden by later tablet or print selectors.
- The Ingredients trigger remains in the navigator at an unintended width.
- The navigator retains an empty second grid column after the trigger is hidden.
- Dialog styles leak into the normal overview.
- The one-column mobile ordering differs from semantic group order.

## 2. Actual font metrics and wrapping

Character counts do not predict precise wrapping because:

- The application font may render wider or narrower than expected.
- Fraction characters change line length.
- Bold action leads affect available line width.
- Browser zoom and font smoothing change perceived density.
- Long ingredients may wrap differently across platforms.

The proposed `900–920px` width must therefore be selected visually.

## 3. Sticky positioning

Static checks cannot fully validate:

- The stage navigator's sticky top offset beneath the global header.
- Whether the navigator jumps when the Ingredients button disappears.
- Whether stage links land below both sticky layers.
- Whether the last stage remains active at the true document bottom.
- Whether horizontally scrolling mobile stages remain usable.

## 4. Native dialog behavior

The ingredient sheet uses native `<dialog>` behavior.

Without a browser, the following remain partially unverified:

- Backdrop clicking.
- Focus containment.
- Escape dismissal.
- Scroll locking without horizontal layout shift.
- Focus restoration after closing.
- Mobile bottom-sheet positioning.
- Printing while a dialog is open.

Logic-level mocks passed, but browser behavior still matters.

## 5. Balanced-column visual weight

Ingredient counts are only an estimate. One long wrapped ingredient can equal two or three short rows.

The balancing algorithm may need a better weight:

```text
base group heading weight
+ ingredient count
+ additional weight for ingredient strings above a length threshold
```

Do not add complexity before seeing the rendered result. Start with item count plus heading weight, then adjust only if screenshots show a repeatable failure.

## 6. Method line length

Removing `68ch` fixes the visibly arbitrary blank area, but it may produce lines that are too long in the widest allowed method.

The preview must determine whether to:

- Keep `920px`.
- Reduce the shared width to `900px` or `880px`.
- Increase method padding slightly.

Avoid solving this with another independent paragraph width.

## 7. Ingredient button behavior at the breakpoint

The control should be mobile/narrow only, but the correct transition point must be observed.

Potential failure modes:

- It disappears while the stage list is already cramped.
- It appears while the desktop navigator still has abundant room.
- Its icon-only mobile treatment is unclear.
- The stage scrollbar becomes visually dominant in narrow desktop windows.

## 8. Print layout

The print rules have been checked statically, but print preview is required to validate:

- Balanced columns do not split groups awkwardly.
- The dialog does not print.
- The Ingredients trigger does not print.
- Stage headings stay with their first actions.
- The complete list appears exactly once.

## What Has Been Verified Without Preview

The following checks have passed:

- JavaScript syntax for `app.js` and recipe data.
- Recipe schema JSON parsing.
- Balanced CSS brace counts.
- `git diff --check` whitespace validation.
- All five structured recipes have valid earlier-stage references.
- Stage and action IDs are unique.
- Every structured direct ingredient reference exists in its complete list.
- No structured complete-list ingredient is unused.
- Structured ingredient groups now number three or four per recipe.
- Complete overview and dialog use the same ingredient renderer.
- Overview and sheet produce the same complete ingredient row count.
- Structured current-stage ingredient markers render from stable IDs.
- Prepared-component context renders separately.
- Legacy recipes render no false current-stage markers.
- Mocked dialog open/close behavior updates expanded state.
- Mocked dialog behavior locks and restores page scrolling.
- Mocked dialog behavior restores trigger focus.
- The final-stage tracker uses document-bottom handling rather than a narrow observer band.

These checks reduce implementation risk, but they do not replace visual inspection.

## Verified Preview Connection State Before Restart

The following state was observed in the current Codex session:

- The Browser integration skill exists locally.
- The Browser runtime is installed and enabled through the `node_repl` MCP server.
- Browser runtime initialization succeeds far enough to expose the browser API.
- Requesting the in-app browser backend returns `Browser is not available: iab`.
- Listing attached browser instances returns an empty array: `[]`.
- Therefore, no controllable in-app Browser instance is attached to this session.
- A normal external Chrome or Edge window does not satisfy that requirement.

The local HTTP state was also checked:

- Port `5173` is listening at the operating-system level.
- `http://localhost:5173` returns HTTP 404.
- Therefore, no usable Rowta preview was available at that URL.

## Codex Integration State Before Restart

The following MCP servers are registered and enabled:

- `node_repl`
- `sites-design-picker`
- `openaiDeveloperDocs`

The official OpenAI developer documentation MCP server was registered during this thread:

```text
openaiDeveloperDocs -> https://developers.openai.com/mcp
```

It is enabled in global Codex configuration but is not callable in the current already-running session. Restarting Codex is required for the refreshed tool set to appear.

## Restart Setup Checklist

After restarting Codex:

1. Open this workspace:

   ```text
   D:\Projects\family-grocery-planner
   ```

2. Open or enable the Codex in-app Browser/preview surface.
3. Confirm that the new Codex session can list at least one browser instance.
4. Start a local static server from the project root.
5. Use a stable local URL, preferably:

   ```text
   http://127.0.0.1:8000
   ```

6. Open that URL inside the Codex-controlled Browser, not only an external browser.
7. Confirm that the Rowta logo and planner render rather than a directory listing or 404.
8. Open the direct recipe routes listed below.

If Python's Windows launcher is available, a suitable server command is:

```powershell
py -m http.server 8000
```

Run it from:

```text
D:\Projects\family-grocery-planner
```

If `py` is unavailable, use another installed static server. The restarted session should discover what is installed rather than assuming Node is on `PATH`; the current PowerShell environment did not expose a `node` command.

## Direct Recipe Routes for Preview

Use these routes after the server starts:

```text
http://127.0.0.1:8000/#recipe/asian-chicken-lettuce-cups-with-rice
http://127.0.0.1:8000/#recipe/chicken-piccata
http://127.0.0.1:8000/#recipe/chicken-satay-rice-bowls
http://127.0.0.1:8000/#recipe/crispy-buffalo-chicken-with-side-salad-and-broccoli
http://127.0.0.1:8000/#recipe/cacio-e-pepe-with-caesar-salad-kit
```

Also test at least one legacy recipe route from the catalog.

## Work Sequence After Restart

## Phase 1: Establish a trustworthy preview

1. Verify the working directory is on `D:`.
2. Start the local server.
3. Connect the Codex in-app Browser.
4. Open Chicken Piccata.
5. Confirm images, styles, scripts, and recipe routes load without console errors.
6. Capture the current desktop baseline before editing.

Do not begin CSS changes until the preview can be refreshed reliably.

## Phase 2: Implement the shared desktop width

1. Add the shared recipe content-width variable.
2. Apply it to overview, navigator, and method.
3. Remove paragraph-level `68ch` on desktop.
4. Inspect Piccata at `1440 × 900`.
5. Compare `880px`, `900px`, `920px`, and `940px` only if needed.
6. Choose one width based on the method line length and overview balance.

## Phase 3: Implement balanced ingredient columns

1. Add a helper that estimates group weight.
2. Add a helper that assigns groups to two columns.
3. Render explicit column containers on desktop.
4. Preserve one-column semantic rendering for narrow layouts and dialog mode.
5. Verify all five structured recipes.
6. Verify at least one legacy recipe with a single group.
7. Confirm equipment stays below both columns.

## Phase 4: Make ingredient access responsive by intent

1. Hide the Ingredients control on full desktop.
2. Collapse the navigator to one column when the trigger is hidden.
3. Retain the trigger and bottom sheet on mobile/slim layouts.
4. Test the transition around the selected breakpoint.
5. Decide whether legacy desktop recipes need a separate non-tracker access pattern.

## Phase 5: Refine safety and contextual notes

1. Replace the full Piccata safety rectangle with a compact annotation.
2. Confirm Family Flex remains subordinate.
3. Confirm Ready When remains a stage footer.
4. Check notes with long and short text.
5. Verify notes at mobile widths.

## Phase 6: Full responsive validation

Test at these viewport targets:

```text
1440 × 900   large desktop
1280 × 800   common desktop
1024 × 768   small desktop/tablet landscape
820 × 1180   tablet portrait
760 × 900    breakpoint boundary
520 × 900    narrow web
390 × 844    mobile
```

At every size verify:

- No horizontal page overflow.
- Stage navigation remains usable.
- Sticky offsets are correct.
- Ingredient groups are balanced or linear as intended.
- Method text uses the intended width.
- Safety guidance does not dominate.
- The mobile ingredient sheet opens and closes correctly.

## Phase 7: Interaction validation

For structured recipes:

1. Scroll through every stage.
2. Confirm the correct stage remains highlighted.
3. Confirm the last stage highlights at document bottom.
4. On narrow layouts, open Ingredients during each stage.
5. Confirm direct current-stage ingredients are emphasized.
6. Confirm prepared components appear as `Bring forward` rather than re-highlighting raw ingredients.
7. Close with the button, Escape, and backdrop.
8. Confirm focus and scroll position restoration.

For legacy recipes:

1. Confirm the complete list appears once.
2. Confirm no inferred stage ingredient highlighting appears.
3. Confirm the method remains readable without structured action leads.
4. Evaluate whether removing desktop ingredient access creates a practical lookup problem.

## Phase 8: Print validation

1. Open browser print preview from a structured recipe.
2. Confirm the ingredient overview prints exactly once.
3. Confirm the stage navigator and Ingredients trigger do not print.
4. Confirm the dialog does not print, even if it was open first.
5. Confirm ingredient groups do not split awkwardly.
6. Confirm action paragraphs and safety annotations remain readable in grayscale.

## Screenshot Set to Capture

Capture these images after implementation:

1. Piccata desktop at the ingredient overview.
2. Piccata desktop at Stage 1.
3. Piccata desktop showing the compact safety annotation.
4. Hoisin desktop ingredient balance.
5. Satay desktop Stage 2 density.
6. Buffalo desktop ingredient balance and long branch instructions.
7. Cacio desktop compact overview.
8. Piccata at the tablet breakpoint.
9. Piccata mobile ingredient overview.
10. Piccata mobile stage navigator.
11. Piccata mobile ingredient bottom sheet.
12. One legacy recipe on desktop and mobile.

## Desktop Acceptance Criteria

The desktop refinement is complete when:

1. Ingredient overview, stage navigator, and method share one visual axis and width.
2. The ingredient overview no longer spans substantially wider than the method.
3. Ingredient groups form two visibly balanced stacks.
4. No large empty third ingredient column remains.
5. The desktop stage navigator contains only stage progress.
6. The Ingredients control remains available on mobile/slim layouts.
7. Action text does not stop at an arbitrary inner boundary.
8. Method line length remains comfortable at large desktop widths.
9. Safety guidance reads as contextual annotation rather than a full-width alert.
10. Family Flex and Ready When remain subordinate to actions.
11. All five structured recipes look deliberate rather than merely valid.
12. Legacy recipes remain usable.
13. Mobile behavior does not regress.
14. Print behavior does not regress.

## Concerns That Must Remain Visible During Implementation

- Do not optimize only for Chicken Piccata.
- Do not use equal-width columns as a substitute for visual balance.
- Do not add another arbitrary text-width rule inside the method.
- Do not restore a persistent desktop ingredient rail.
- Do not keep the desktop Ingredients button merely because the dialog already exists.
- Do not infer legacy stage ingredients from prose.
- Do not weaken safety information while reducing its visual weight.
- Do not change mobile behavior until it has been visually compared before and after.
- Do not declare the task complete based only on syntax and static data checks.

## Expected Restart Prompt

After restarting, use this document as the source of truth and ask Codex to continue with:

```text
Open docs/desktop-recipe-layout-preview-handoff.md, establish the local in-app preview, then execute and visually validate the desktop recipe refinements described there. Preserve the working mobile ingredient experience.
```

## Final Handoff State

At the time this document was written:

- No desktop refinement described in this document had yet been applied.
- The prior ingredient-overview and mobile-sheet implementation remained in the working tree.
- The Browser integration was present but had zero attached browser instances.
- No usable Rowta localhost preview was running.
- Static validation was passing.
- A restart was the appropriate next step before additional visual implementation.
