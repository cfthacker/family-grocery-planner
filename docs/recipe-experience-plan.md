# Rowta Recipe Experience Plan

## Status

This document defines the recipe-reading and cooking experience. The initial implementation boundary was completed on July 12, 2026; catalog-wide migration and Cook mode remain future phases.

Implemented in the initial delivery:

- Structured stage, ingredient-use, action, equipment, timing, safety, and completion-cue data.
- Backward-compatible rendering for legacy string-step recipes.
- Five fully edited prototype recipes.
- Stage-specific ingredient lists.
- Action-led methods without visible global step numbers.
- Grouped complete ingredient lists.
- Sticky stage context and active-stage tracking.
- Tighter desktop, mobile, and print layouts.

It covers:

- Stage-based recipe structure.
- Stage-specific ingredients.
- Recipe-view and Cook-mode concepts.
- Recipe data architecture.
- Editorial and copy standards.
- Catalog migration strategy.
- Accessibility, print, and validation requirements.

The current recipe detail implementation remains a useful prototype, but its stage definitions are still title-and-step-index mappings in `app.js`. Those mappings should be treated as a temporary compatibility layer, not the final recipe model.

## Product Decisions

The following decisions should guide the work:

1. The stage is the primary unit of cooking progress.
2. Visible global step numbers should be removed.
3. Actions remain ordered internally and visually flow from top to bottom.
4. Each action receives a meaningful action title instead of relying on a number.
5. The full ingredient list remains available for shopping, preparation, and printing.
6. Every stage also shows the exact ingredients required at that point.
7. Ingredient-to-stage relationships are explicitly curated in recipe data.
8. Every substantial stage ends with a recognizable completion cue.
9. Family-flex guidance appears at the moment a cooking decision must be made.
10. Recipe view and Cook mode are separate experiences.
11. A small set of representative recipes should establish the pattern before the entire catalog is migrated.

The resulting hierarchy is:

```text
Recipe
└── Stage
    └── Ordered actions
```

The product should communicate progress as `Stage 2 of 3`, not `Step 8 of 10`.

## Experience Model

### Recipe View

Recipe view is a complete, continuous, printable reference. It helps a cook understand the entire meal, prepare ingredients, and move around the method nonlinearly.

It includes:

- Recipe image, title, and overview.
- Total and active time.
- Servings and effort.
- Planning status.
- Complete grouped ingredient list.
- Stage overview.
- All stages and actions.
- Stage-specific ingredient lists.
- Equipment where it materially helps.
- Parallel-work cues.
- Contextual family-flex and safety notes.
- Stage completion cues.
- Notes, sources, and print support.

### Cook Mode

Cook mode is a later, focused stove-side experience. It presents one active stage at a time and emphasizes stage completion rather than passive reading.

It includes:

- Current recipe and stage context.
- Ingredients required for the active stage.
- Equipment for the active stage.
- Ordered actions.
- Completion checkpoint.
- Previous and next stage controls.
- Saved progress and resume behavior.

Cook mode should be built only after the recipe data and writing have been proven in the continuous recipe view.

## Recipe View Information Architecture

```text
Recipe detail
├── Recipe hero
│   ├── Image
│   ├── Title and overview
│   ├── Total time / active time / serves / effort
│   └── Start cooking / add to week / print
├── Sticky recipe context
│   ├── Back to recipes or week
│   ├── Compact recipe title
│   └── Current stage and stage navigation
├── Stage overview
│   └── Stage titles and approximate durations
├── Recipe body
│   ├── Complete grouped ingredient list
│   └── Method
│       ├── Stage header
│       ├── Stage-specific ingredients
│       ├── Equipment
│       ├── Ordered actions
│       ├── Contextual family or safety note
│       └── Ready-when checkpoint
└── Good to know / sources
```

### Desktop Layout

The desktop layout should retain the current two-column foundation:

- Left: complete ingredient list, sticky within the recipe body.
- Right: continuous staged method.

The method panel should not be divided into a stack of heavy cards. Stages should feel like parts of one recipe, separated by clear headings and restrained dividers.

### Mobile Layout

On mobile:

- Use a shorter recipe hero.
- Keep the complete ingredient list before the method.
- Allow the complete list to collapse after the cook reaches the method.
- Include a persistent way to reveal all ingredients again.
- Render stage-specific ingredients inside each stage.
- Use a compact sticky title and active-stage bar.
- Provide a bottom `Start cooking` action when Cook mode becomes available.
- Do not hide required content behind mutually exclusive ingredient/method tabs.

## Stage Design

Each stage should answer four questions immediately:

1. Where am I?
2. What do I need now?
3. What should I do next?
4. How do I know this stage is complete?

A stage should follow this general structure:

```text
STAGE 2 OF 3 · ABOUT 12 MIN

Cook the filling

You’ll need
1 tbsp neutral oil
1 small yellow onion, finely diced
1 lb ground chicken
2 cloves garlic, minced
Prepared sauce from Stage 1

Equipment
Large skillet · Wooden spoon

Soften the onion.
Heat the oil over medium-high. Cook the onion for 2–3 minutes,
until soft and translucent.

Brown the chicken.
Cook for 5–7 minutes, breaking it into small crumbles, until
browned and 165°F in the center.

Family flex
Set aside a portion here if someone prefers the filling without sauce.

Glaze the filling.
Add two-thirds of the sauce and simmer for 1–2 minutes, until
it clings to the chicken.

Ready when
The chicken is 165°F and the filling is glossy, with no liquid
pooling in the pan.
```

### Stage Titles

Stage titles should describe a meaningful goal or state transition.

Good examples:

- Prep the components.
- Brown the chicken.
- Cook the filling.
- Build the sauce.
- Toss and finish.
- Build and serve.

Avoid vague titles:

- Preparation.
- Cooking.
- Next steps.
- Finishing.
- Method part two.

Most recipes should contain three to five stages. A simple recipe may have two. A genuinely complex recipe may have six.

### Stage Duration

Show an approximate duration when it helps the cook understand progress:

```text
Stage 2 of 3 · About 12 minutes
```

Duration is informational in the first implementation. Timers should be a later enhancement.

### Stage Completion

Every substantial stage should end with a checkpoint such as:

- `Ready when`
- `Move on when`
- `Serve when`

Examples:

- The chicken is browned and the pan is mostly dry.
- The vegetables are bright and tender-crisp.
- The sauce coats the spoon without pooling.
- The pasta is tender and the sauce is glossy.
- Serve while the lettuce is crisp.

## Ingredient Model

### Complete Ingredient List

The complete ingredient list is the canonical shopping and preparation view.

It should be grouped by cooking component rather than grocery aisle:

- For the filling.
- For the sauce.
- For the slaw.
- To assemble.
- Optional toppings.

Grocery-store sections should remain in the underlying data for grocery generation, but they should not determine recipe-page grouping.

Use `Serves 4`, not `4 servings`.

### Stage-Specific Ingredients

Every stage should display a compact `You’ll need` list containing only the ingredients handled or added during that stage.

Rules:

- Show exact stage-use quantities.
- Preserve preparation state, such as `finely diced` or `drained`.
- Preserve first-use order within the stage.
- Mark optional ingredients explicitly.
- Put serving ingredients in the serving stage.
- Keep equipment separate from ingredients.
- Omit the ingredient block when a stage needs no new ingredients.
- Do not infer these lists from instruction text at render time.

### Divided Ingredients

Divided ingredients require explicit use quantities.

Example:

```text
Complete list: 4 tbsp butter, divided
Stage 1: 1 tbsp butter
Stage 3: Remaining 3 tbsp butter
```

### Prepared Components

A later stage may consume the result of an earlier stage. Present that as a prepared component instead of repeating all of its source ingredients.

Examples:

- Prepared sauce from Stage 1.
- Cooked rice from Stage 1.
- Breaded chicken.
- Reserved pasta water.

### Ingredient Checkboxes

The current decorative ingredient squares are ambiguous. They could mean that an ingredient is owned, prepared, used, or added to a grocery list.

For normal recipe view:

- Remove decorative checkboxes.
- Use bullets or unmarked rows.

For a future Cook mode:

- Use real controls only when their meaning and persistence are defined.
- Prefer action and stage completion over ingredient completion as the primary progress model.

## Action and Numbering Model

Visible global action numbers should be removed.

Actions should remain inside semantic ordered lists because order still matters, but the visible markers can be suppressed. The stage communicates progress, and the action title communicates the immediate task.

Example:

```text
Soften the onion.
Brown the chicken.
Add the vegetables.
Glaze the filling.
```

If testing later shows that cooks lose their place within long stages, small local numbering can be introduced and reset within each stage. It should not be the default.

## Editorial System

### Rowta Voice

Recipe writing should be:

- Calm.
- Capable.
- Direct.
- Plainspoken.
- Specific.
- Confident about the primary path.
- Flexible about genuine alternatives.
- Family-aware without assuming that every child has the same preferences.

Use imperative verbs such as:

- Heat.
- Add.
- Stir.
- Brown.
- Rest.
- Taste.
- Serve.

Avoid filler and generated-sounding language:

- At this point.
- You will want to.
- Make sure to.
- So that it does not.
- If desired, repeated throughout the recipe.
- As needed, without explaining the actual decision.
- Until done.
- Until ready.
- Looks good.

### Action-Writing Formula

Use this sequence:

```text
Action lead → instruction → heat/time → observable cue
```

Example before editing:

> Add the ground chicken and cook for 5 to 7 minutes, breaking it into small crumbles, until no pink remains and some moisture has cooked off. Let it sit undisturbed for short stretches so it lightly browns instead of steaming.

Example after editing:

> **Brown the chicken.** Cook over medium-high heat for 5–7 minutes, breaking it into small crumbles. Pause briefly between stirs so it can brown. It is ready when no pink remains and the pan is no longer watery.

### Copy Limits

- Action title: two to five words.
- One primary action per row.
- Usually 20–40 words per action.
- No more than two short sentences unless safety requires more.
- Include at most one useful guardrail.
- Include a reason only when it changes what the cook should do.
- Include time when duration affects execution.
- Include heat when the setting affects the outcome.
- End with a concrete visual, textural, temperature, or sound cue.

### Positive Targets

Prefer positive completion targets over warnings.

Instead of:

- Not deeply browned.
- Not watery.
- Do not let it burn.
- So it does not steam.

Prefer:

- Soft and translucent.
- Glossy, with no liquid pooling.
- Fragrant.
- Browned at the edges.

Warnings should remain only where the failure is likely and materially affects the result or safety.

### Information Placement

| Information | Recommended location |
| --- | --- |
| Substitution | Ingredient note |
| Parallel work | Stage introduction |
| Heat and timing | Action |
| Doneness | Action cue or stage checkpoint |
| Safety temperature | Relevant action |
| Family decision | Before the irreversible action |
| Optional garnish | Serving stage |
| Recovery advice | Quiet `If needed` note |
| General family flexibility | Recipe overview |

### Family-Flex Language

Avoid subjective guidance such as:

> The sauce should be mild enough for the kids.

Prefer neutral, actionable guidance:

> Set aside a portion before adding the sauce if someone prefers the filling plainer. Keep sriracha and chili crisp at the table.

Place family-flex notes immediately before:

- A strong or spicy sauce is added.
- Components become permanently combined.
- A texture choice becomes irreversible.
- Garnishes or toppings are applied.

### Parallel-Work Cues

Place a short cue below the stage heading when tasks can safely overlap:

> Start the rice first. Prep the lettuce and mix the sauce while it cooks.

Use parallel cues only when they save meaningful time and do not pull attention away from an active high-heat task.

## Example Recipe Rewrite

The current `Asian Chicken Lettuce Cups with Rice` could become the more descriptive `Hoisin Chicken Lettuce Cups with Rice`.

### Stage 1 of 3 — Prep Lettuce, Rice, and Sauce

**About 15 minutes**

Start the rice first. Prep the lettuce and sauce while it cooks.

**You’ll need**

- 1½ cups uncooked rice.
- 1 large head butter or iceberg lettuce.
- ⅓ cup hoisin sauce.
- 2 tbsp low-sodium soy sauce.
- 1 tbsp rice vinegar.
- 1 tsp toasted sesame oil.

**Start the rice.** Cook according to the package directions. Fluff, cover, and keep warm.

**Prep the lettuce.** Separate the leaves, then rinse and dry them well. Arrange the best cup-shaped leaves for serving; chop torn leaves for rice bowls.

**Mix the sauce.** Whisk the hoisin, soy sauce, rice vinegar, and sesame oil until smooth. Set aside.

**Ready when:** The rice is warm, the lettuce is dry, and the sauce is smooth.

### Stage 2 of 3 — Cook the Filling

**About 12 minutes**

**You’ll need**

- 1 tbsp neutral oil.
- 1 small yellow onion, finely diced.
- 1 lb ground chicken.
- 2 cloves garlic, minced.
- 1 tbsp grated ginger, optional.
- 1 (8-oz) can water chestnuts, drained and chopped.
- 1 cup shredded carrots.
- Prepared sauce, about two-thirds to start.

**Soften the onion.** Heat the oil in a large skillet over medium-high heat. Add the onion and cook for 2–3 minutes, until soft and translucent.

**Brown the chicken.** Add the chicken and spread it across the pan. Cook for 5–7 minutes, breaking it into small crumbles, until browned and 165°F in the center. Pause briefly between stirs so it can brown.

**Add the crunch.** Stir in the garlic, ginger, water chestnuts, and carrots. Cook for 1–2 minutes, until the garlic is fragrant and the carrots begin to soften.

**Family flex:** Set aside a portion now if someone prefers the filling without sauce. Keep sriracha and chili crisp for the table.

**Glaze the filling.** Add about two-thirds of the sauce and simmer for 1–2 minutes, stirring, until it clings to the chicken. Taste and add more sauce if needed.

**Ready when:** The chicken is 165°F and the filling is glossy, with no liquid pooling in the pan.

### Stage 3 of 3 — Build and Serve

**About 3 minutes**

**You’ll need**

- Prepared lettuce cups.
- Warm rice.
- Chicken filling.
- 2 scallions, thinly sliced.
- Sriracha or chili crisp, optional.

**Set out the components.** Bring the lettuce, rice, filling, scallions, and optional heat to the table.

**Build the cups.** Add a small spoonful of rice to each leaf, then top with chicken and scallions. Keep the cups lightly filled so they are easy to hold.

**Family flex:** Offer the rice, lettuce, and filling separately for anyone who prefers a bowl or deconstructed plate.

**Serve now:** Enjoy while the rice and filling are warm and the lettuce is crisp.

## Sticky Recipe Context

Once the hero leaves the viewport, retain the recipe and stage context:

```text
← Recipes | Hoisin Chicken Lettuce Cups | Stage 2 of 3 · Cook the filling
```

Requirements:

- Update the current stage based on scroll position.
- Apply `aria-current="step"` to the active stage-navigation item.
- Smooth-scroll unless reduced motion is enabled.
- Focus the stage heading after a deliberate navigation click.
- Do not announce every passive scroll change to screen readers.
- Account for sticky headers with `scroll-margin-top`.

## Visual Refinements

Preserve text size and gain density through spacing.

Recommended adjustments:

- Reduce the desktop recipe hero from approximately 430px to 300–340px.
- Reduce method horizontal padding to approximately 30–32px.
- Reduce stage vertical padding by approximately 20%.
- Reduce action padding and vertical gaps by approximately 20%.
- Stack the stage label above its title.
- Remove the global-number column.
- Remove the introductory `Read the stage overview...` sentence.
- Keep method text around 60–70 characters per line.
- Use tinted backgrounds only for meaningful supporting information.
- Avoid adding a border or card around every action.
- Retain the warm cream, sage, and apricot Rowta palette.

## Proposed Data Model

The final stage relationships should live inside each recipe record.

```js
{
  id: "hoisin-chicken-lettuce-cups",
  revision: 2,

  ingredientDetails: [
    {
      id: "ground-chicken",
      original: "1 lb ground chicken",
      genericIngredient: "Ground chicken",
      quantity: 1,
      unit: "lb",
      component: "For the filling",
      optional: false,
      section: "Protein"
    }
  ],

  stages: [
    {
      id: "cook-filling",
      title: "Cook the filling",
      durationMinutes: 12,
      parallelCue: "",

      ingredientUses: [
        {
          ingredientId: "neutral-oil",
          quantity: 1,
          unit: "tbsp"
        },
        {
          ingredientId: "ground-chicken",
          quantity: 1,
          unit: "lb"
        },
        {
          ingredientId: "prepared-sauce",
          sourceStageId: "prep",
          display: "Prepared sauce, about two-thirds to start"
        }
      ],

      equipment: [
        "Large skillet",
        "Wooden spoon"
      ],

      actions: [
        {
          id: "brown-chicken",
          title: "Brown the chicken",
          instruction: "Add the chicken and spread it across the pan.",
          duration: {
            min: 5,
            max: 7,
            unit: "minute"
          },
          heat: "medium-high",
          cue: "Browned with no liquid pooling",
          safetyTemperatureF: 165,
          ingredientRefs: [
            "ground-chicken"
          ],
          tip: "Pause briefly between stirs so the chicken can brown."
        }
      ],

      familyNote: "Set aside a portion before adding the sauce if someone prefers it plainer.",
      readyWhen: "The chicken is 165°F and the filling is glossy, with no liquid pooling."
    }
  ]
}
```

### Data Principles

- Ingredient IDs are stable within a recipe.
- Stage IDs are stable.
- Action IDs are stable.
- Ingredient-to-stage relationships are explicit.
- Display wording remains editor-controlled.
- Structured duration, heat, safety, and ingredient fields support future features.
- The UI should not automatically generate complete prose from structured fields.
- Recipe revision supports future Cook-mode progress migration.

### Required Edge Cases

The model must support:

- Ingredient divided across stages.
- Ingredient reused in several stages.
- Ingredient without a numeric quantity.
- Optional ingredient.
- Ingredient used only for serving.
- Pantry staple used `as needed`.
- Prepared component passed to a later stage.
- Stage with no new ingredients.
- One-stage recipe.
- Recipe with five or six stages.
- Parallel tasks.
- Passive resting, baking, or simmering time.
- Optional cooking branch.
- Family portion removed before sauce or spice.
- Temperature-based food safety.
- Package-size quantities.
- Ingredient alternatives.
- Direct recipe links and printing.
- Recipe revision after Cook-mode progress has been saved.

## Implementation Plan

### Phase 0 — Lock the Content Contract

Before UI changes:

- Approve the recipe hierarchy.
- Approve removal of visible global numbers.
- Approve stage-specific ingredient rules.
- Approve the action-writing standard.
- Approve ingredient grouping.
- Select the prototype recipes.
- Add the editorial QA rubric to the recipe-builder documentation.

**Deliverable:** Approved schema and writing guide.

### Phase 1 — Extend the Recipe Data Model

Add:

- Stable ingredient IDs.
- Cooking-component groups.
- Explicit stage records.
- Ingredient uses per stage.
- Structured action records.
- Stage duration.
- Equipment.
- Parallel-work cue.
- Ready-when cue.
- Contextual family note.
- Recipe revision.

Update normalization so it accepts:

- New structured stages.
- Existing string steps.
- The current stage-blueprint fallback.

Do not remove legacy behavior yet.

**Deliverable:** Old and new recipes both render safely.

### Phase 2 — Build Five Editorial Prototypes

Fully restructure and rewrite five representative recipes:

1. Asian Chicken Lettuce Cups — component-heavy assembly recipe.
2. Chicken Piccata — divided ingredients and pan sauce.
3. Chicken Satay Bowls — parallel components and assembly.
4. Crispy Buffalo Chicken — breading, equipment, safety, and sides.
5. Cacio e Pepe — technique-sensitive sauce and timing.

For each prototype:

- Confirm stage boundaries.
- Assign every ingredient.
- Resolve divided quantities.
- Rewrite actions.
- Add time and heat.
- Add observable cues.
- Add safety information.
- Place family-flex decisions.
- Add stage checkpoints.
- Review desktop, mobile, and print behavior.

**Deliverable:** Five complete recipes that define the pattern for the remaining catalog.

### Phase 3 — Refine the Continuous Recipe View

Implement:

- Stage-specific `You’ll need` blocks.
- Action-led instructions.
- No visible global numbers.
- Stacked stage label and title.
- Tighter spacing.
- Grouped complete ingredient list.
- Removal of decorative ingredient checkboxes.
- Stage duration.
- Equipment where useful.
- Ready-when callouts.
- Contextual family-flex callouts.
- Sticky recipe and stage context.
- Revised print layout.

**Deliverable:** Polished continuous recipe reference.

### Phase 4 — Evaluate the Prototypes

Before migrating the catalog:

- Cook from the prototype recipes.
- Confirm that stage ingredient duplication is useful.
- Confirm that actions remain clear without visible numbering.
- Check whether stages are too long or too granular.
- Test sticky context and stage navigation.
- Review mobile and printed layouts.
- Perform the stove-side scan test.

The stove-side scan asks whether a cook can identify within three seconds:

- Current stage.
- Required ingredients.
- Next action.
- Completion cue.

**Deliverable:** Confirmed design or one focused refinement pass.

### Phase 5 — Migrate the Remaining Catalog

Migrate the remaining recipes in batches of approximately six.

Each recipe receives two review passes.

#### Structural Review

- Stage boundaries.
- Ingredient allocation.
- Sequence.
- Parallel work.
- Equipment.
- Family decision points.
- Safety.

#### Line-Edit Review

- Action titles.
- Brevity.
- Timing.
- Heat.
- Sensory cues.
- Tone.
- Terminology.

Remove `recipeStageBlueprints` after every recipe has explicit structured stages.

**Deliverable:** All recipes use the same content model.

### Phase 6 — Add Cook Mode

After the catalog has structured stages:

- Add a route such as `#recipe/<id>/cook`.
- Present one active stage at a time.
- Show stage-specific ingredients and equipment.
- Support stage completion.
- Add previous and next stage controls.
- Support resume and start-over behavior.
- Save local progress.
- Add mobile sticky controls.
- Add a finish-cooking flow.
- Allow marking the recipe as cooked and rating it.

Action check-offs may be supported, but they should not block stage completion.

**Deliverable:** Dedicated stove-side experience.

### Phase 7 — Later Enhancements

Defer until the core model is stable:

- Timers.
- Screen wake lock.
- Serving scaling.
- Ingredient highlighting.
- Voice progression.
- Hands-free controls.
- More complex parallel-task visualization.

Scaling should remain deferred because current quantities contain ranges, package sizes, optional amounts, and ambiguous values.

## Cook-Mode Progress Model

Stage completion is primary. Action check-off is optional support.

```js
{
  recipeId,
  recipeRevision,
  currentStageId,
  completedStageIds: [],
  completedActionIds: [],
  startedAt,
  updatedAt
}
```

Expected behavior:

- `Start cooking` begins at the first incomplete stage.
- Existing progress offers `Resume` and a secondary `Start over`.
- Completing a stage advances to the next stage.
- Cooks may move backward or jump ahead.
- Actions do not all need to be checked before completing a stage.
- Final completion offers `Done cooking`, rating, and return-to-week actions.
- Progress is keyed to recipe revision so incompatible edits do not restore stale state.

## Accessibility Requirements

- Use `<article>` for the recipe.
- Use `<nav aria-label="Recipe stages">` for stage navigation.
- Use `<section aria-labelledby>` for every stage.
- Keep actions as semantic ordered lists even without visible markers.
- Use real checkboxes and buttons only when they perform real actions.
- Apply `aria-current="step"` to the active stage.
- Focus stage headings after deliberate navigation.
- Announce deliberate stage completion in a polite live region.
- Do not announce every scroll-based stage change.
- Preserve visible focus.
- Do not rely on color alone for current or completed state.
- Respect reduced-motion preferences.
- Maintain at least 44px touch targets in Cook mode.
- Present safety cues with text, not color alone.

## Print Requirements

Print should be a distinct reference layout rather than a screenshot of Cook mode.

- Hide global navigation, sticky bars, actions, and interactive controls.
- Use a compact recipe title, summary, time, and servings block.
- Print the complete grouped ingredient list.
- Print all stages in order.
- Include stage-specific ingredients in a compact format.
- Keep a stage heading, ingredient block, and first action together where possible.
- Avoid splitting an action across pages.
- Use grayscale-safe borders and text.
- Retain family-flex and safety notes.
- Do not reintroduce global action numbering.
- Print the complete recipe even when printing from Cook mode.

## Validation Plan

### Automated Data Validation

Validate that:

- Ingredient IDs are unique within the recipe.
- Stage IDs are unique.
- Action IDs are unique.
- Every ingredient reference exists.
- Every required ingredient appears in at least one stage.
- Optional state remains consistent.
- Every stage contains at least one action.
- Divided amounts reconcile when numeric.
- Stage use does not unexpectedly exceed the complete quantity.
- Prepared components reference an earlier stage.
- No action depends on a later-stage output.
- Duration fields use valid forms.
- Temperature fields are numeric and plausible.
- No recipe produces an empty method.

### Editorial QA Rubric

Score each category from 0–2:

1. Stage logic.
2. Ingredient mapping.
3. Sequence.
4. Action clarity.
5. Timing and heat.
6. Doneness and safety.
7. Brevity and scanability.
8. Family flexibility.
9. Voice consistency.
10. Overall cookability.

Require:

- At least 17/20 overall.
- No category scored zero.
- Full scores for ingredient accuracy, sequence, and safety.

### Experience QA

Test:

- Desktop recipe view.
- Narrow desktop.
- Phone portrait.
- Long ingredient lists.
- Three-stage and six-stage recipes.
- One-stage legacy recipe.
- Missing image.
- Direct URL and browser Back.
- Keyboard navigation.
- Screen-reader structure.
- Reduced motion.
- Print preview.
- Family-flex visibility.
- Food-safety visibility.

## Initial Implementation Boundary

The first implementation should include:

- New structured recipe schema.
- Compatibility with existing recipes.
- Five fully rewritten prototype recipes.
- Refined continuous recipe view.
- Stage-specific ingredients.
- Removal of visible global action numbers.
- Action-led recipe writing.
- Stage completion cues.
- Sticky recipe and stage context.
- Updated mobile and print layouts.

It should not yet include:

- Timers.
- Serving scaling.
- Screen wake lock.
- Voice interaction.
- Full Cook mode.
- Automated ingredient-stage inference.

This boundary provides enough real material to evaluate the core idea before restructuring the entire recipe catalog.
