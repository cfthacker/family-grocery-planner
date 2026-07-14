# Structured Recipe Catalog Migration Plan

## Purpose

This document defines how to bring the remaining 31 recipes up to the standard established by the five hand-authored structured recipes:

1. Hoisin Chicken Lettuce Cups with Rice
2. Chicken Piccata
3. Chicken Satay Rice Bowls with Peanut Sauce and Carrot-Cucumber Slaw
4. Crispy Buffalo Chicken with Side Salad and Broccoli
5. Cacio e Pepe with Caesar Salad Kit

It is both a content specification and an execution plan. It records which parts of the prototype work should become catalog-wide rules, which earlier ideas have been intentionally removed, how each recipe should be migrated, and how the result should be validated.

The goal is not to make every recipe look mechanically identical. The goal is to give every recipe the same level of culinary reasoning, data integrity, scanability, and family usefulness while preserving the natural shape of the dish.

## Current Status

- The catalog contains 36 recipes.
- Five recipes received the complete hand-authored prototype treatment.
- The remaining 31 recipes contain ingredients, stages, and actions, but their presence alone does not make those recipes equivalent to the prototypes.
- The remaining recipes still require an intentional editorial review of stage boundaries, ingredient relationships, quantities, sequence, cues, branches, safety, and family guidance.
- The standalone `Ready when` pattern has been removed from the prototype data contract and shared renderer.
- Useful completion information must now be written directly into the action that produces the result.

## Correct Order of Work

The work should proceed in this order:

1. Finalize the five prototype rules.
2. Remove rejected patterns from the shared schema and renderer.
3. Lock this migration specification.
4. Audit all 31 remaining recipes before rewriting them.
5. Migrate recipes in controlled batches.
6. Validate each batch editorially, structurally, visually, and in print.
7. Complete a catalog-wide consistency pass.

This order prevents the migration from reproducing a component—such as a separate `Ready when` footer—that has already been judged unnecessary.

---

# Part I — The Approved Structured Recipe Pattern

## 1. A Recipe Is Organized Around Meaningful Stages

A stage represents a useful mental goal or state transition, not an arbitrary group of similarly sized steps.

Good stage examples:

- Prepare the chicken
- Cook the rice and make the sauce
- Sear the cutlets
- Build the pan sauce
- Assemble the bowls
- Dress and serve

Weak stage examples:

- Get ready
- Continue cooking
- Next steps
- Finish up
- Stage 1

Most recipes should contain three to five stages. Use two for a genuinely simple recipe. Use six only when the cooking process truly contains six distinct mental phases.

Stage boundaries should help a cook answer:

> What am I trying to accomplish right now?

They should not exist simply to divide a long recipe into equal visual sections.

### Each stage requires

- A stable kebab-case `id`.
- A concise, action-oriented `title`.
- A realistic `durationMinutes` value when time is useful.
- A curated `ingredientUses` collection.
- One or more ordered `actions`.
- Equipment only when it materially affects execution.
- Contextual family or safety guidance only when it belongs at that point.

## 2. The Complete Ingredient List Is Grouped by Cooking Purpose

Ingredients should be organized around how the cook thinks about the dish, not grocery-store taxonomy.

Good groups include:

- For the chicken
- For the sauce
- For the pasta and sauce
- For the slaw
- For the bowls
- To assemble
- To finish
- Optional toppings

Avoid excessive fragmentation. Most recipes should use two to four meaningful groups. A group containing one item is acceptable only when the separation communicates a real role, such as `To finish` or `For serving`.

### Group requirements

- Every ingredient has a stable ID.
- Every ingredient has one authored component name.
- `ingredientComponentOrder` explicitly records the intended reading order.
- Group names remain consistent within a recipe.
- Ingredient groups are never inferred solely from grocery categories.
- A group is never split between desktop columns.

## 3. Ingredient Records Remain the Canonical Source

Every complete-list ingredient should retain the information needed for grocery planning and recipe rendering:

- Stable `id`
- Original display wording
- Generic ingredient name
- Quantity
- Unit
- Grocery section
- Cooking component
- Optional status
- Pantry-staple status where applicable
- Preferences and product-search terms where useful

The original wording should be readable as a shopping and prep instruction. Do not rely on UI code to reconstruct nuanced wording from generic fields.

Examples:

- `4 tbsp unsalted butter, divided`
- `¾ cup low-sodium chicken broth, plus ¼ cup if skipping wine`
- `1½ lb thin chicken breast cutlets`
- `Chopped parsley, optional`

## 4. Optionality Is Authored Once

Optional status should be clear without being repeated through a label, badge, heading, and sentence.

Rules:

- Store optionality in structured data.
- Include `optional` in display text when that is the most natural reading.
- Do not add a separate optional badge beside text that already says `optional`.
- An `Optional toppings` or `Optional finish` heading may carry the meaning for the entire group; individual rows beneath it do not need to repeat the word.
- A substitution is not necessarily optional. Describe substitutions in the relevant instruction or ingredient wording.

## 5. Pantry Staples Are Separated Quietly

Everyday oils, salt, and pepper should not visually compete with the primary shopping list.

Rules:

- Mark true household staples with `pantryStaple: true`.
- Keep them available in the complete ingredient reference.
- Display them in a quiet `Pantry staples` section.
- Omit them from stage-level `You’ll need` lists unless a precise amount or special form is essential to execution.
- Do not classify a specialty sauce, spice blend, cheese, or garnish as a pantry staple merely because some households may own it.

## 6. Every Stage Has a Deliberate Working Ingredient Set

The stage-level `You’ll need` list answers:

> What ingredients or prepared components matter during this stage?

It is not a copy of the complete ingredient list.

### Direct ingredients

Use `ingredientId` to reference a canonical complete-list ingredient.

The display wording may show the stage-specific portion:

```js
{
  ingredientId: "butter",
  display: "1 tbsp butter"
}
```

This is important for divided ingredients. The complete list might say `4 tbsp butter, divided`, while individual stages show the amount used at that moment.

### Prepared components

Use `sourceStageId` when a later stage needs something created earlier:

```js
{
  sourceStageId: "sear-chicken",
  display: "Seared chicken cutlets"
}
```

Prepared components should be described in the state in which the cook now needs them:

- Cooked pasta and reserved pasta water
- Prepared peanut sauce
- Marinated chicken
- Breaded cutlets
- Warm rice
- Roasted vegetables

Do not invent a new complete-list ingredient for a prepared component.

### Relationship requirements

- Every direct `ingredientId` must exist in the complete ingredient list.
- Every `sourceStageId` must reference an earlier stage.
- Every complete-list ingredient must have a legitimate use.
- Divided amounts must reconcile with the complete quantity.
- A stage should not list an ingredient that its actions never use.
- An action should not introduce an ingredient that is absent from both the stage working set and a clearly identified earlier component.

## 7. Actions Are the Primary Cooking Experience

Each stage contains a short ordered set of action records. Actions remain semantically ordered even though the interface does not need visible global step numbers.

Each action includes:

- A stable `id`.
- A short action title.
- One cohesive instruction.
- Ingredient references when useful.
- Structured time, heat, cue, and temperature metadata when useful.

### Action-title standard

Prefer two to five words:

- Brown the chicken
- Bloom the pepper
- Build the sauce
- Reserve the pasta water
- Dress the salad

Avoid headings that add no information:

- Get ready
- Cook
- Continue
- Next
- Complete the recipe

### One action, one coherent task

An action may contain several tightly related physical movements, but it should not hide an entire stage in one paragraph.

Split an action when:

- The heat changes materially.
- The cook must wait for a different observable state.
- A family branch occurs between operations.
- Food-safety handling changes.
- The result becomes an input to another component.

Merge actions when:

- The split creates a heading for a trivial movement.
- The second action merely says to set something aside.
- Two sentences describe one uninterrupted operation.

## 8. Completion Cues Belong Inside the Relevant Action

There is no standalone `Ready when`, `Move on when`, or `Serve now` section.

The instruction that produces a result must include the evidence that the result is complete.

### Approved pattern

> Bake for 16–20 minutes, until the coating is deeply golden and crisp and the center reaches 165°F.

> Add the cheese gradually, tossing constantly. Loosen with small splashes of pasta water and continue tossing until the sauce is smooth and creamy, with no dry clumps of cheese, and clings to every strand.

> Simmer for 3–5 minutes, until the sauce lightly coats the back of a spoon.

### Rejected pattern

> Bake the chicken for 16–20 minutes.
>
> **Ready when:** The chicken is crisp and reaches 165°F.

### Cue-writing rules

- Put the cue in the same action that creates the result.
- Include required safety temperatures directly in visible instruction prose.
- Prefer observable evidence: color, texture, sound, consistency, aroma, temperature, or lack of rawness.
- Use time as a range or estimate, not the only evidence of doneness.
- Avoid repeating a cue at the bottom of the stage.
- Delete a cue that only says the completed task is complete.
- Structured `cue` and `safetyTemperatureF` metadata may remain for validation or future tools, but visible instructions must remain complete without it.
- Do not restore `readyWhen` or `readyLabel` to the stage schema.
- Do not add a new UI treatment that recreates the same footer under a different name.

## 9. Time, Heat, and Doneness Are Written Naturally

Instructions should contain the operational information a cook needs at the stove.

Good:

> Heat the oil over medium-high. Add the onion and cook for 2–3 minutes, until soft and translucent.

Weak:

> Cook the onion.

Rules:

- State the heat before the ingredient enters the pan when it matters.
- Use realistic time ranges.
- Include an observable cue alongside time.
- Include internal temperature in the relevant cooking action.
- Do not put time in a decorative badge when it already appears in the sentence.
- Do not repeat heat, duration, or temperature in adjacent prose.

## 10. Sequence Must Be Culinarily Correct

Every migrated recipe needs a genuine cooking review—not merely grammatical cleanup.

Confirm:

- Water is boiling before pasta is added unless a tested cold-start method is intentionally specified.
- Ovens and air fryers are preheated early enough.
- Rice begins early enough to finish with the meal.
- Raw meat handling occurs before clean assembly where practical.
- Garlic is not exposed to high heat long enough to burn.
- Pans are not overcrowded when browning is the goal.
- Sauces reduce before cold finishing butter or cheese is added.
- Cheese-emulsion steps manage heat to prevent clumping or breaking.
- Pasta water is reserved before draining.
- Salads are dressed close to serving.
- Resting, marinating, or passive cook time is represented honestly.
- Parallel tasks are ordered so the meal finishes together.
- Package directions are invoked only where they are genuinely the best authority.

## 11. Parallel Work Is Embedded Where It Helps

Parallelism should reduce total time without making the instructions harder to follow.

Prefer natural sequencing:

> Bring the pasta water to a boil. While it heats, pat the chicken dry and prepare the dredging station.

Avoid a separate preview sentence that simply repeats the actions below.

Keep a structured `parallelCue` only if it may support future guided cooking. The visible recipe should communicate the timing through action order and concise prose.

## 12. Family Flexibility Appears at Real Decision Points

Family guidance should change what the cook does, when they do it, or how they serve it.

Useful examples:

- Reserve a plain portion before adding a spicy sauce.
- Use the lower quantity of pepper in the shared skillet.
- Keep capers or dressing at the table.
- Serve bowl components separately for a deconstructed plate.

Rules:

- Do not repeat the same family advice in the hero and inside a stage.
- Keep one concise recipe-level family-flexibility summary when it is useful.
- If a stage-level note is retained in the data, anchor it before the action where the choice must be made.
- Do not include generic advice such as `Kids may prefer this plain` unless it changes the recipe’s execution.
- Do not make adult flavor the default and describe the family version as an afterthought; design the branch intentionally.

## 13. Safety Guidance Is Contextual

Safety belongs where the risk occurs.

Examples:

- Clean the flour station after dredging raw chicken.
- Cook poultry to 165°F.
- Keep a hot skillet handle turned inward.
- Avoid returning cooked food to a raw-protein plate.

Rules:

- Put food temperatures in the cooking action itself.
- Use a separate safety annotation only for handling guidance that cannot be folded naturally into the action.
- Keep safety wording direct and calm.
- Do not stretch a minor note into a dominant full-width warning.
- Do not bury required safety information in metadata alone.

## 14. Equipment Is Useful, Aggregated, and Restrained

Stage data may identify equipment where it affects feasibility or technique:

- Air fryer
- Sheet pan
- Wire rack
- Large skillet
- Wide pot
- Instant-read thermometer

The normal recipe view should aggregate and deduplicate meaningful equipment once near the complete ingredients.

Rules:

- Do not repeat equipment within every visible stage.
- Omit universally obvious tools unless size or shape matters.
- Preserve optional equipment branches accurately.
- Never imply that optional equipment is required.
- Ensure alternate methods include the equipment and timing they need.

## 15. Recipe Revision and Stable IDs

Each migrated recipe should have a revision value. IDs should remain stable across copy edits whenever the underlying ingredient, stage, or action still represents the same concept.

Stable IDs enable:

- Ingredient-to-stage validation
- Prepared-component handoffs
- Future guided-cooking progress
- Saved state migration
- Reliable tests
- Targeted editorial updates

Do not derive IDs from temporary display text at render time.

---

# Part II — Approved Page Behavior

## 16. Complete Ingredients Appear Once Before the Method

The complete ingredient reference belongs between the recipe hero and method.

Current behavior to preserve:

- The card begins in a compact collapsed state.
- A four-item preview provides quick orientation.
- One full-width disclosure control reveals the complete list.
- Desktop uses balanced ingredient-group stacks without splitting a group.
- Narrow layouts use the authored semantic group order.
- Equipment appears once beneath the complete list.
- Pantry staples are visually quiet.
- The ingredient list does not remain sticky beside the entire recipe.

## 17. Stage Ingredients Remain Inline

Each stage retains a compact `You’ll need` working set.

This is operational context, not a second complete ingredient card. It should remain subordinate to the actions.

Do not:

- Add checkboxes that have no saved behavior.
- Add optional badges beside optional wording.
- Add a persistent ingredient button on desktop.
- Restore the full-height ingredient rail.
- Guess stage ingredients for a recipe whose mappings have not been authored.

## 18. Stage Titles Are Visible and Stable

Every stage should clearly display:

- Stage number
- Stage count
- Stage duration when useful
- Stage title

The stage treatment should not depend on hover or scroll position to become legible. A cook should be able to scan the entire method and see its structure immediately.

## 19. Actions Dominate the Hierarchy

The method hierarchy should be:

1. Stage identity
2. Action title and instruction
3. Stage working ingredients
4. Contextual family or safety annotation

Completion cues are part of action prose and therefore do not create a fifth competing visual component.

## 20. Removed Patterns Stay Removed

Do not reintroduce:

- Standalone `Ready when` or `Serve now` blocks
- Global numbered steps running across stages
- Floating or sticky stage tracker
- Persistent desktop Ingredients shortcut
- Sticky full-height ingredient rail
- Decorative time pills inside steps
- Repeated optional badges
- Stage-level equipment blocks
- `Get ready`, `Cook in stages`, or other low-value eyebrows
- A generic visible `Method` heading when the stages already establish the section
- `Good to know` and `Recipe sources` disclosures at the end of the cooking flow
- Preview copy that simply summarizes the steps immediately below it

Source data may remain available internally, but it should not interrupt the primary cooking experience.

## 21. Responsive and Print Requirements

Every migrated recipe must work at:

- Wide desktop
- Standard laptop
- Tablet portrait
- Narrow web panel
- Phone portrait
- Print layout

Print should:

- Expand the complete ingredient list.
- Print ingredients exactly once.
- Print all stages and actions.
- Hide interactive disclosure controls.
- Hide application navigation and planning controls.
- Preserve family and safety guidance when useful.
- Avoid orphaned stage headings.

---

# Part III — Migration Workflow for Each Recipe

## 22. Step 1: Read the Whole Recipe Before Editing

Review together:

- Overview
- Complete ingredient list
- Existing stages and actions
- Family guidance
- Equipment
- Source notes where available
- Total and active time
- Servings

Do not edit one stage in isolation before understanding the full cooking timeline.

## 23. Step 2: Build a Cooking Timeline

Write a short internal timeline:

1. What starts first?
2. What can happen in parallel?
3. What must finish before another task begins?
4. Which components need to remain hot, crisp, or cold?
5. Where do family or safety branches occur?
6. What determines that each component is actually done?

Use the timeline to identify stage boundaries.

## 24. Step 3: Audit the Complete Ingredient List

For every ingredient:

- Confirm the amount supports four servings.
- Confirm the unit and package size are usable.
- Confirm alternatives are understandable.
- Confirm optionality.
- Confirm pantry-staple status.
- Confirm component group.
- Confirm stable ID.
- Confirm divided amounts.
- Confirm it appears in the cooking method.

Flag ingredients that are:

- Never used
- Introduced only in prose
- Duplicated under different names
- Missing an amount where one matters
- Incompatible with the stated method
- Presented as optional even though the method depends on them

## 25. Step 4: Author the Stages

Create three to five goal-oriented stages in the order the cook experiences them.

For each stage:

- Assign a stable ID.
- Write a concise title.
- Estimate its elapsed duration.
- Identify direct ingredients.
- Identify prepared inputs from earlier stages.
- Identify meaningful equipment.
- Identify any family or safety decision.

Then read only the stage titles. They should tell a coherent story of the meal.

## 26. Step 5: Map Ingredients and Handoffs

Populate each stage’s `ingredientUses`.

Check:

- Direct ingredient IDs.
- Stage-specific quantities.
- Prepared-component source stages.
- Display wording.
- Optional status.
- Pantry-staple omission.

Create a quantity reconciliation note for divided ingredients before writing actions.

## 27. Step 6: Rewrite the Actions

Rewrite from culinary intent rather than preserving old sentence boundaries.

Each action should answer the relevant subset of:

- What do I do?
- With which ingredient or component?
- In which vessel?
- At what heat?
- For roughly how long?
- What should I observe?
- What temperature is required?
- What happens next?

Remove:

- Filler
- Repeated setup
- Generic encouragement
- Redundant serving language
- Cues repeated after the action
- Headings for trivial movements
- Unnecessary culinary jargon

## 28. Step 7: Embed Every Completion Cue

Search the recipe for every statement about:

- Doneness
- Texture
- Color
- Aroma
- Sauce consistency
- Temperature
- Crispness
- Tenderness
- Serving urgency

Move each useful statement into the action that produces that condition.

Then confirm:

- There is no `readyWhen` field.
- There is no `readyLabel` field.
- No prose says `Ready when:` as a separate paragraph.
- Every required temperature appears in visible action prose.
- No final-stage summary repeats the final action.

## 29. Step 8: Review Branches and Family Flexibility

For every alternative method or family branch:

- Identify the exact decision point.
- Confirm quantities still work in both branches.
- Confirm the timing works.
- Confirm the required equipment is listed.
- Keep the branch concise enough to follow while cooking.
- Avoid forcing every user to read a long alternative they will not use.

## 30. Step 9: Run an Editorial Read-Aloud

Read the recipe from the perspective of someone actively cooking.

Look for:

- Pronouns with unclear referents
- `It` when several components are present
- Long sentences with multiple heat changes
- Instructions that require knowledge introduced later
- Missing transfer or holding instructions
- Ingredients that suddenly appear
- Contradictory timing
- Repeated phrases
- Overuse of `then`, `until`, `optional`, or `set aside`
- Steps that sound correct grammatically but are wrong culinarily

## 31. Step 10: Validate Data and Rendering

Run structural validation, render the recipe, and compare desktop, mobile, and print behavior before considering it migrated.

---

# Part IV — Migration Batches

The 31 recipes should be migrated in batches ordered by increasing editorial and technical risk. The exact membership may change after the initial audit, but no recipe should skip the same definition of done.

## Batch 1 — Calibration and Relatively Simple Assembly

Use these to refine the migration workflow without beginning with the most technique-sensitive recipes:

- [ ] Beef Tacos with Yellow Rice
- [ ] Shortcut Spaghetti and Meatballs
- [ ] Pesto Tortellini in Red Pepper Sauce
- [ ] Chicken Tostadas with Refried Beans and Guacamole
- [ ] Mexican-Style Beef Rice Bowls
- [ ] 20-Minute Sausage & Pepper Ravioli Skillet

Focus:

- Component grouping
- Shortcut and package-direction wording
- Assembly stages
- Optional toppings
- Family-style serving
- Honest time estimates

## Batch 2 — Skillets and Straightforward Protein Meals

- [ ] Pork Sausage, Peppers, and Onions Skillet
- [ ] Teriyaki Chicken and Broccoli Skillet
- [ ] Mediterranean Chicken with Tomatoes, Olives, and Feta
- [ ] Garlic-Butter Chicken with Green Beans or Asparagus
- [ ] Chicken Stir-Fry with Rice
- [ ] Crispy Chicken Cutlets with Quick Salad
- [ ] Balsamic Garlic Chicken with Potatoes

Focus:

- Heat sequencing
- Crowding and browning
- Protein temperatures
- Parallel sides
- Sauce timing
- Alternate vegetables

## Batch 3 — Bowls, Noodles, and Multiple Components

- [ ] Weeknight Chicken Fried Rice
- [ ] Ground Beef Sesame Noodles
- [ ] Bang Bang Chicken Rice Bowls
- [ ] Sweet & Spicy Beef Noodles with Bok Choy & Shredded Carrots
- [ ] Chinese Pepper Steak with Microwave Rice
- [ ] Chicken, Leek & Brown Rice Stir-Fry
- [ ] Asian Beef with Snow Peas and Rice

Focus:

- Prepared-component handoffs
- Sauce allocation
- Divided oils and aromatics
- Rice timing
- Stir-fry mise en place
- Family spice branches

## Batch 4 — Pasta, Pan Sauces, and Emulsions

- [ ] Orecchiette with Sausage and Broccoli Rabe
- [ ] Greek Lemon Chicken One-Pan Pasta
- [ ] Cajun Chicken Pasta
- [ ] Chicken Marsala Over Egg Noodles
- [ ] Chicken Tender Parmesan with Angel Hair
- [ ] Classic Shrimp Scampi with Linguine

Focus:

- Boiling-water sequence
- Pasta-water reservation
- Sauce reduction
- Heat control
- Cheese, butter, and emulsion cues
- Alcohol substitutions
- Carryover cooking
- Shrimp and chicken doneness

## Batch 5 — High-Complexity and Multi-Method Recipes

- [ ] Steak Frites with Air-Fryer Fries
- [ ] Mini Meatballs with Tomato Sauce Over Orzo
- [ ] Moroccan-Style Chicken & Couscous
- [ ] Summer Pesto & Pancetta Ravioli
- [ ] Chicken & Red Pepper Romesco with Creamy Parmesan Orzo & Zucchini

Focus:

- Multiple active components
- Equipment-dependent branches
- Coordinated finish time
- Resting and holding
- Sauce and side integration
- Longer ingredient working sets
- Avoiding instructions that become dense mini-recipes

## Batch Gate

Do not begin the next batch until:

- Every recipe in the current batch passes data integrity checks.
- Every recipe has received an editorial cooking review.
- At least one wide desktop and one phone rendering has been inspected for every recipe.
- The longest and shortest recipe in the batch pass print review.
- New renderer problems are fixed generically rather than with recipe-ID-specific CSS or JavaScript.

---

# Part V — Validation

## 32. Automated Data Checks

For every migrated recipe, verify:

- Recipe ID is unique.
- Ingredient IDs are unique within the recipe.
- Stage IDs are unique within the recipe.
- Action IDs are unique within the recipe.
- Every stage has at least one action.
- Every direct stage ingredient reference exists.
- Every action ingredient reference exists.
- Every source-stage reference points backward.
- Every complete-list ingredient has a legitimate use.
- Every authored component appears in `ingredientComponentOrder`.
- No empty ingredient groups render.
- Equipment aggregation contains no duplicates.
- No `readyWhen` or `readyLabel` property exists.
- No instruction contains a separated `Ready when:` label.
- Safety-temperature metadata is echoed in visible prose.
- Structured JSON and JavaScript parse successfully.
- The recipe schema parses and accepts every migrated record.

## 33. Quantity Checks

For every divided ingredient:

- Sum explicit stage quantities where feasible.
- Confirm the result does not exceed the complete-list quantity.
- Confirm `remaining`, `divided`, or `as needed` language is understandable.
- Confirm alternate branches do not accidentally require both quantities.
- Confirm the serving size remains four unless intentionally changed.

## 34. Culinary Checks

Ask of every recipe:

- Would an experienced home cook agree with the sequence?
- Could a newer cook follow it without guessing?
- Are heat and time plausible?
- Does each cooked protein have an adequate doneness cue?
- Are required safety temperatures visible?
- Are sauces likely to reduce, emulsify, or thicken as described?
- Are vegetables likely to reach the described texture?
- Do parallel components finish near the same time?
- Are optional branches internally complete?
- Is serving urgency stated naturally where quality depends on it?

## 35. Copy Checks

- Stage titles describe goals.
- Action titles describe concrete tasks.
- Instructions begin with direct verbs.
- No stage preview repeats its actions.
- No completion footer repeats the final action.
- Optionality appears once.
- Family advice appears once and at the correct decision point.
- `Set aside` is used only when the holding action matters.
- Pronouns are unambiguous.
- Time, heat, and doneness read as one natural instruction.
- The page ends with useful cooking or serving information.

## 36. Visual Checks

At minimum test:

- 1440 × 900
- 1280 × 800
- 1024 × 768
- 820 × 1180
- 760 × 900
- 520 × 900
- 390 × 844

Confirm:

- No page-level horizontal overflow.
- Ingredient groups remain intact.
- Desktop ingredient columns feel reasonably balanced.
- Narrow ingredient groups follow semantic order.
- The disclosure reports the correct hidden count.
- Stage titles are always visible.
- Stage ingredients remain subordinate.
- Action prose uses the available method width.
- Safety annotations do not dominate the stage.
- There is no standalone completion treatment.
- Long branch instructions remain readable.
- Print expands ingredients and hides controls.

## 37. Accessibility Checks

- Recipe title is the page’s primary heading.
- Ingredient and method structures use semantic headings.
- Stage actions remain ordered lists.
- Disclosure state uses `aria-expanded` and `aria-controls`.
- Keyboard focus is visible.
- Hidden collapsed content is not exposed inconsistently.
- Color is not the only signal for optional or safety information.
- Print does not omit content hidden only for interactive presentation.

---

# Part VI — Definition of Done

A recipe is migrated only when all of the following are true:

## Data

- [ ] Stable recipe, ingredient, stage, and action IDs exist.
- [ ] Ingredient components and component order are authored.
- [ ] Optional and pantry statuses are correct.
- [ ] Stage ingredient mappings are complete.
- [ ] Prepared-component handoffs point to earlier stages.
- [ ] Divided quantities reconcile.
- [ ] Meaningful equipment is represented.
- [ ] No `readyWhen` or `readyLabel` data remains.

## Editorial

- [ ] Stage boundaries represent meaningful cooking goals.
- [ ] Actions have concise titles and coherent instructions.
- [ ] The full sequence has received a culinary review.
- [ ] Time, heat, and observable cues are natural and plausible.
- [ ] Every necessary doneness and safety cue is embedded in its action.
- [ ] Parallel work is understandable.
- [ ] Family flexibility changes execution or serving in a useful way.
- [ ] Optional branches are complete and concise.
- [ ] Filler and repeated wording have been removed.

## Experience

- [ ] Complete ingredients work collapsed and expanded.
- [ ] Stage working ingredients are correct.
- [ ] Actions dominate the visual hierarchy.
- [ ] No sticky ingredient rail or standalone completion footer appears.
- [ ] Desktop, mobile, and print have been reviewed.
- [ ] Keyboard and semantic structure remain usable.

## Validation

- [ ] Schema and JavaScript parsing pass.
- [ ] Relationship validation passes.
- [ ] Quantity checks pass.
- [ ] No new console errors occur.
- [ ] No tested viewport has horizontal overflow.
- [ ] `git diff --check` passes.

---

# Part VII — Implementation Phases

## Phase 0 — Lock the Standard

- Review this document against the five prototypes.
- Confirm that the standalone completion pattern is permanently rejected.
- Confirm component, stage, action, family, safety, and equipment rules.
- Treat the five prototypes as editorial references, not immutable templates.

Deliverable: approved catalog migration contract.

## Phase 1 — Build the Audit Report

Before rewriting, generate a catalog-wide report for the remaining 31 recipes:

- Ingredient count and component count
- Stage and action count
- Missing or duplicate IDs
- Unused ingredients
- Invalid source-stage references
- Divided ingredients
- Optional ingredients
- Pantry staples
- Safety temperatures
- Long instructions
- Alternative equipment branches
- Existing completion-label language

Deliverable: a prioritized exception list attached to the batch plan.

## Phase 2 — Migrate Batch 1

- Complete all ten per-recipe workflow steps.
- Refine shared validation scripts.
- Resolve general renderer issues.
- Review the results before scaling.

Deliverable: six approved migrated recipes and a proven workflow.

## Phase 3 — Migrate Batches 2 and 3

- Apply the approved pattern to skillet, bowl, noodle, and stir-fry recipes.
- Pay special attention to temperature, browning, divided sauce, and parallel rice timing.

Deliverable: 14 additional approved migrated recipes.

## Phase 4 — Migrate Batches 4 and 5

- Apply the pattern to technique-sensitive pasta, sauce, and multi-component recipes.
- Give these recipes additional culinary and quantity review.

Deliverable: the final 11 migrated recipes.

## Phase 5 — Catalog-Wide Consistency Pass

Review all 36 recipes together for:

- Stage naming
- Ingredient component naming
- Action density
- Temperature language
- Optionality
- Pantry classification
- Family guidance
- Equipment naming
- Duration realism
- Responsive behavior

Deliverable: one coherent catalog rather than five prototypes plus 31 independent rewrites.

## Phase 6 — Remove Temporary Compatibility Logic

Only after all 36 recipes pass:

- Remove obsolete stage-generation fallbacks.
- Remove unused legacy string-step rendering.
- Remove deprecated schema fields.
- Remove migration-only scripts and flags that are no longer needed.
- Preserve source and revision history needed for future maintenance.

Deliverable: one canonical structured recipe path.

---

# Final Principle

The structured format succeeds only when it improves the act of cooking.

The test is not whether a recipe contains stages, IDs, and metadata. The test is whether a cook can glance at the page, understand where they are, see what they need, perform the next action correctly, and recognize the result without consulting a separate explanatory box.

Completion information belongs in the cooking instruction because it is part of the cooking instruction.
