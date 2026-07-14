# Rowta Recipe Page Simplification Plan

## Purpose

This document refines the broader [Recipe Experience Plan](./recipe-experience-plan.md) after reviewing the first structured recipe prototype.

The recipe page now has a strong visual foundation, but it is communicating the same ideas too many times. The next iteration should focus on subtraction, tighter hierarchy, and more confident editing.

The goal is not to redesign the page. The goal is to preserve what is working while removing anything that does not help someone cook.

## Core Principle

Every visible element must answer at least one of these questions:

1. What am I cooking?
2. What do I need?
3. Where am I in the recipe?
4. What should I do now?
5. How do I know I am ready to move on?

If an element does not answer one of those questions, it should be removed, moved, or hidden from the primary recipe experience.

## Summary of Changes

### Keep

- Recipe hero and metadata.
- Complete ingredient list grouped by cooking purpose.
- Stage-specific ingredient lists.
- Short action-led instructions.
- Stage progress.
- Contextual family-flex guidance.
- Useful completion cues.
- Add-to-week and print actions.

### Simplify

- Floating stage navigation.
- Ingredient optional treatment.
- Stage headers.
- Stage ingredient presentation.
- Family-flex and ready-when callouts.
- Overall spacing and nested borders.

### Move

- Equipment from individual stages to the ingredient rail.
- Accessibility headings into visually hidden text when they do not need to be visible.

### Remove

- `Recipe stages` label in the floating navigator.
- Repeated recipe title inside the floating navigator.
- Repeated active-stage sentence inside the floating navigator.
- Stage duration repeated inside navigation items.
- `Get ready` eyebrow.
- `Cook in stages` eyebrow.
- Visible `Method` heading.
- Stage title repeated in the stage body.
- Parallel-work sentence when the actions already communicate the sequence.
- Action metadata pills for heat, time, and temperature.
- Optional badges.
- Decorative ingredient checkboxes.
- `Good to know` disclosure.
- `Recipe sources` disclosure.
- Any action or completion cue that merely restates the preceding instruction.

## Target Page Hierarchy

The simplified page should have four visible layers:

```text
1. Recipe hero
2. Compact stage navigator
3. Ingredients and instructions
4. Contextual family-flex or completion notes only when useful
```

The recipe body becomes:

```text
┌────────────────────────┬───────────────────────────────────────┐
│ Ingredients            │ Stage 1 of 3 · About 15 min           │
│ Serves 4               │                                       │
│                        │ You’ll need                           │
│ For the filling        │ Rice · Lettuce · Hoisin · Soy sauce  │
│ ...                    │                                       │
│                        │ Start the rice                        │
│ To assemble            │ Cook, fluff, cover, and keep warm.   │
│ ...                    │                                       │
│                        │ Prep the lettuce                      │
│ For the sauce          │ Separate, rinse, and dry the leaves. │
│ ...                    │                                       │
│                        │ Mix the sauce                         │
│ Equipment              │ Whisk until smooth. Set aside.       │
│ Large skillet          │                                       │
│ Medium saucepan        │ Ready when the rice is warm, the      │
│ Small mixing bowl      │ lettuce is dry, and sauce is smooth. │
└────────────────────────┴───────────────────────────────────────┘
```

There is no visible `Method` heading and no repeated stage title above the actions.

## Compact Stage Navigation

### Current Problem

The sticky stage navigator is useful, but it contains too many competing pieces:

- `Recipe stages` label.
- Recipe title.
- Current stage status.
- Numbered stage buttons.
- Stage names.
- Stage durations.
- Connector lines.
- Large active background treatment.

This creates awkward spacing and makes the navigator feel like a second header rather than a lightweight orientation tool.

### Proposed Navigator

Use a single compact row:

```text
1 Prep        2 Cook the filling        3 Build and serve
```

Rules:

- Remove the recipe title from the navigator.
- Remove `Recipe stages`.
- Remove the separate `Stage 1 of 3 · About 15 min` sentence.
- Remove duration from each navigation item.
- Remove connector dashes.
- Shorten stage labels for navigation only when needed.
- Use one restrained active treatment: a thin underline, darker number, or very light background.
- Keep the height near 44–52px.
- Align the row to the recipe content instead of presenting it as a large floating card.
- Reduce border radius and shadow.
- Prefer a simple bottom border over a fully outlined floating container.

The detailed stage duration will appear once, in the stage header below.

### Sticky Behavior

- The stage row becomes sticky only after it reaches the top of the recipe body.
- It remains below the global Rowta header.
- It should not cover stage content or the sticky ingredient rail.
- On mobile, it may scroll horizontally.
- The active item still updates while scrolling.
- Stage buttons remain keyboard accessible and use `aria-current="step"`.

## Simplified Stage Header

### Current Problem

A stage currently repeats its meaning through:

- Stage navigator title.
- `Stage 1 of 3 · About 15 min`.
- `Prep lettuce, rice, and sauce` heading.
- `Start the rice first. Prep the lettuce and sauce while it cooks.` introduction.
- The actual actions below.

The cook receives the same information three or four times.

### Proposed Header

Use one header:

```text
Stage 1 of 3 · About 15 min
```

Then proceed directly to stage ingredients and actions.

Remove from the stage body:

- Repeated stage title.
- Parallel-work introduction by default.
- Any explanatory sentence that simply previews the actions below.

Stage names remain in the stage navigator, where they provide orientation without being repeated in the content.

### Exception for Parallel Work

A parallel-work sentence may remain only when it materially changes execution.

Keep:

> Start the oven before breading the chicken so it is ready when the cutlets are coated.

Remove:

> Start the rice first. Prep the lettuce and sauce while it cooks.

The second example is already apparent from the ordered actions and does not need a separate sentence.

## Stage-Specific Ingredients

Stage ingredients remain valuable and should stay.

### Simplification Rules

- Keep a short `You’ll need` label.
- Use a quieter background and less padding.
- Remove the outer nested-card feeling where possible.
- Do not repeat optional badges.
- Do not repeat `optional` in both the ingredient text and a badge.
- Do not show equipment in this area.
- Preserve exact divided quantities when relevant.
- Continue showing prepared components such as `Warm chicken filling` or `Prepared sauce`.

### Optional Ingredients

The page currently repeats optional status in several ways:

```text
1 tbsp ginger, optional          OPTIONAL
```

Use only one treatment.

Recommended rules:

1. If the entire group is optional, label the group once:

   ```text
   Optional toppings
   Sriracha
   Chili crisp
   Chopped peanuts
   ```

2. If one item is optional inside a required group, retain `(optional)` in the ingredient text:

   ```text
   1 tbsp grated ginger (optional)
   ```

3. Remove all `Optional` pill badges.
4. Do not append optional status a second time in stage ingredient lists.

Optional items can remain slightly muted, but color should not be the only indicator.

## Complete Ingredient Column

### Keep the Grouping

The cooking-purpose grouping is successful and should remain:

- For the filling.
- For the sauce.
- To assemble.
- Optional toppings.

### Improve Group Order

Groups should follow first use in the recipe whenever practical. The ingredient rail should read in approximately the same order as the stages.

For the lettuce cups, that likely means:

1. For the sauce.
2. To assemble.
3. For the filling.
4. Optional toppings.

This is preferable to ordering groups based solely on their first appearance in the source ingredient data.

### Remove Low-Value Labels

Display:

```text
Ingredients                         Serves 4
```

Remove:

- `Get ready`.
- Decorative ingredient checkboxes.
- Repeated optional badges.

## Equipment

### Proposed Location

Move equipment out of individual stages and into the ingredient column as a distinct final section:

```text
Equipment
Large skillet
Medium saucepan
Small mixing bowl
```

This gives the cook one place to confirm tools before beginning and prevents every stage from growing another supporting-information block.

### Equipment Inclusion Rule

Equipment should earn its place.

Always include equipment that affects whether the recipe is practical:

- Air fryer.
- Food processor.
- Blender.
- Wok.
- Cast-iron skillet.
- Sheet pan and wire rack.
- Dutch oven.
- Instant-read thermometer when a safety temperature is important.

Consider omitting extremely common tools unless they prevent confusion:

- Wooden spoon.
- Basic plate.
- Standard whisk.
- Generic mixing bowl.

The structured stage equipment data can remain in the recipe model. The renderer will aggregate, deduplicate, and filter it for the ingredient rail.

## Action Rows

### Keep

- Short action title.
- One or two concise instruction sentences.
- Heat, time, temperature, and doneness information when needed.

### Remove

- Yellow or tan metadata pills.
- Repeated `2–3 minutes` tag when the instruction already says `2–3 minutes`.
- Separate heat tags when the instruction already states the heat.
- Temperature tags when the instruction already includes the safety temperature.
- `Look for` rows when the cue is already written naturally in the action.
- `Tip` rows unless the advice materially prevents failure.

The structured data should remain available for future Cook-mode timers and accessibility features. It simply should not be rendered redundantly in the normal recipe view.

### Copy Pruning Standard

Every action must change the cook’s behavior.

Delete actions such as:

- Set out the components.
- Bring everything to the table.
- Get ready to serve.
- Gather the ingredients.

When the stage ingredients already show the components, these actions add no information.

Prefer one strong action:

> **Build the cups.** Add a small spoonful of rice to each leaf, then top with chicken and scallions. Keep the cups lightly filled so they are easy to hold.

Instead of:

> **Set out the components.** Bring the lettuce, rice, filling, scallions, and optional heat to the table.
>
> **Build the cups.** Add a small spoonful of rice...

## Section Headings

### Visible Headings to Keep

- Ingredients.
- Stage progress line.
- Action titles.
- Contextual `Family flex` when useful.
- `Ready when` or `Serve now` when it adds a genuine checkpoint.
- Equipment in the ingredient rail, when applicable.

### Visible Headings to Remove

- Rowta recipe.
- Get ready.
- Cook in stages.
- Method.
- Recipe stages.
- Good to know.
- Recipe sources.

The page still needs semantic headings for accessibility. Use visually hidden headings where the document structure requires them but the visible label adds no value.

## Family-Flex and Completion Notes

These elements should remain, but only when they add information not already present in the action.

### Family Flex

Keep a family-flex callout when it identifies a decision point:

> Set aside a portion before adding the sauce if someone prefers the filling plainer.

Remove broad or repetitive advice that does not affect the cooking sequence.

### Ready When

Keep:

> The chicken is 165°F and the filling is glossy, with no liquid pooling.

Remove:

> The rice is cooked and ready to use.

If the final action already contains the complete cue, do not repeat it in a separate `Ready when` block.

Use completion blocks selectively rather than requiring one for every stage.

## Good to Know and Recipe Sources

Remove both disclosures from the primary recipe page.

### Good to Know

Useful notes should be moved to the exact place where they affect cooking:

- Ingredient substitutions go with ingredients.
- Recovery guidance goes with the relevant action.
- Family choices go before the relevant action.
- Reheating guidance belongs in a future leftovers area, not in a generic disclosure.

Anything that cannot be placed contextually should be reviewed for deletion.

### Recipe Sources

Source information should remain in the recipe data for provenance and editorial review, but it does not need to be displayed in the normal cooking experience.

Possible future locations:

- Internal recipe editor.
- Recipe information page.
- Export metadata.
- Administrative provenance view.

It should also be omitted from the default print layout.

## Hero Simplification

The hero is visually successful and should remain largely intact.

Potential subtraction:

- Remove the `Rowta recipe` eyebrow.
- Keep title, overview, time, servings, effort, add action, and print.
- Consider placing `Print recipe` beside the Add action instead of on a separate row.
- Preserve the shorter hero height from the previous refinement.

This is a low-priority adjustment compared with simplifying the recipe body.

## Simplified Stage Example

### Before

```text
COOK IN STAGES
Method

STAGE 1 OF 3 · ABOUT 15 MIN
Prep lettuce, rice, and sauce
Start the rice first. Prep the lettuce and sauce while it cooks.

YOU’LL NEED
...

EQUIPMENT
...

Start the rice
Cook according to the package directions...
```

### After

```text
Stage 1 of 3 · About 15 min

You’ll need
1½ cups uncooked rice
1 large head butter or iceberg lettuce
⅓ cup hoisin sauce
2 tbsp low-sodium soy sauce
1 tbsp rice vinegar
1 tsp toasted sesame oil

Start the rice
Cook according to the package directions. Fluff, cover, and keep warm.

Prep the lettuce
Separate the leaves, then rinse and dry them well. Arrange the best
cup-shaped leaves for serving; chop torn leaves for rice bowls.

Mix the sauce
Whisk the hoisin, soy sauce, rice vinegar, and sesame oil until smooth.
Set aside.

Ready when the rice is warm, the lettuce is dry, and the sauce is smooth.
```

## Implementation Plan

### Phase 1 — Create a Subtraction Inventory

Update the renderer so every existing element is classified as:

- Keep.
- Simplify.
- Move.
- Remove.

Confirm that structured metadata remains in recipe data even when it is no longer displayed.

**Deliverable:** Stable content inventory with no accidental data removal.

### Phase 2 — Simplify the Stage Navigator

- Remove the navigator label, recipe title, status sentence, durations, and connector lines.
- Reduce height, padding, shadow, and border treatment.
- Keep only compact numbered stage names.
- Preserve active-stage tracking, keyboard behavior, and mobile overflow.
- Recalculate sticky offsets for the ingredient rail and stage sections.

**Deliverable:** One compact orientation row rather than a second header.

### Phase 3 — Simplify the Recipe Body Hierarchy

- Remove `Get ready`.
- Remove `Cook in stages`.
- Replace visible `Method` with a visually hidden `Instructions` heading.
- Remove stage titles and preview copy from stage bodies.
- Retain only the stage progress line.
- Remove action metadata pills.
- Remove stage-level equipment blocks.
- Remove optional badges.

**Deliverable:** Ingredients, stage progress, stage ingredients, and actions become the dominant hierarchy.

### Phase 4 — Move and Filter Equipment

- Aggregate equipment from all stages.
- Deduplicate equipment names.
- Add a restrained equipment section below the complete ingredient list.
- Filter out tools that do not help someone decide whether they can cook the recipe.
- Preserve all equipment data for future Cook mode.

**Deliverable:** One optional recipe-level equipment section.

### Phase 5 — Edit the Five Prototypes

Perform a subtraction pass on each prototype:

1. Hoisin Chicken Lettuce Cups.
2. Chicken Piccata.
3. Chicken Satay Rice Bowls.
4. Crispy Buffalo Chicken.
5. Cacio e Pepe.

For every stage:

- Remove preview copy that restates actions.
- Delete obvious setup or serving actions.
- Merge actions when the distinction adds no value.
- Remove completion cues that repeat the final action.
- Keep family notes only at real decision points.
- Ensure optional wording appears only once.

**Deliverable:** Five concise editorial references for future catalog migration.

### Phase 6 — Remove Low-Value Footer Content

- Remove `Good to know` from recipe rendering.
- Remove `Recipe sources` from recipe rendering and printing.
- Preserve source data and useful notes in the data model.
- Move any genuinely useful note into its relevant ingredient, action, or family-flex location.

**Deliverable:** Recipe pages end with the final useful cooking instruction or completion cue.

### Phase 7 — Tighten Styling

- Reduce vertical spacing between stage ingredients and actions.
- Reduce nested borders and tinted boxes.
- Keep one subtle treatment for stage ingredients.
- Keep family-flex and completion treatments visually distinct but quiet.
- Ensure the ingredient rail and instruction column align cleanly.
- Check that sticky elements do not overlap.
- Revisit mobile density independently from desktop.

**Deliverable:** A lighter page with fewer visual containers and shorter scrolling distance.

### Phase 8 — Validate Before Catalog Migration

Run the five prototype recipes through:

- Desktop review.
- Phone portrait review.
- Sticky navigation review.
- Print review.
- Keyboard navigation.
- Screen-reader heading audit.
- Three-second stove-side scan.
- Copy-duplication review.

Only after this pass should the simplified structure be applied to the remaining catalog.

## Acceptance Criteria

### Navigator

- Contains only stage numbers and names.
- Occupies a single compact row on desktop.
- Has one clear active treatment.
- Contains no repeated title, status sentence, or duration.
- Does not overlap ingredients or stage content.

### Ingredient Column

- Begins with `Ingredients`, without an eyebrow.
- Uses cooking-purpose groups.
- Shows optional status once.
- Contains no decorative checkboxes or optional badges.
- Contains one equipment section only when useful.

### Stage Body

- Begins with one line: `Stage X of Y · About N min`.
- Does not repeat the stage name.
- Does not include preview copy unless it materially changes execution.
- Does not display equipment.
- Does not display metadata pills.
- Uses stage-specific ingredients and concise action rows.

### Copy

- No action exists merely to say `set out`, `gather`, or `bring to the table`.
- Optional status is never displayed twice for the same ingredient.
- Heat, time, and temperature are not repeated outside the action text.
- Family-flex notes appear only at meaningful decision points.
- Completion cues are omitted when they repeat the final action.

### Footer

- No `Good to know` disclosure.
- No `Recipe sources` disclosure.
- The page ends with useful recipe content.

### Accessibility

- Semantic recipe and instruction structure remains intact.
- Removed visible headings are replaced by visually hidden headings where required.
- Stage navigation retains `aria-current="step"`.
- Focus behavior and reduced-motion support remain intact.
- Optional status is communicated with text, not color alone.

## First Implementation Boundary

The first simplification implementation should cover only the five structured prototype recipes and the shared recipe renderer.

It should include:

- Compact navigator.
- Simplified headings.
- Equipment aggregation.
- Removal of metadata pills and optional badges.
- Removal of footer disclosures.
- Five-recipe copy pruning.
- Desktop, mobile, and print refinement.

The remaining legacy recipes should continue to render through the compatibility layer until the simplified prototype is reviewed and approved.
