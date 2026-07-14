# Structured Recipe Catalog Migration Audit

## Result

The catalog now uses one canonical structured recipe source for all 36 recipes. The five prototype recipes remain the editorial reference, and the other 31 recipes now follow the same stage, action, ingredient-component, pantry, optionality, equipment, and family-flexibility model.

## Final catalog metrics

- 36 recipes
- 446 canonical ingredient records
- 107 culinary pantry-staple records
- 61 explicitly optional ingredients
- 130 goal-oriented stages
- 302 titled actions
- 29 prepared-component handoffs
- 595 stage working-ingredient relationships
- 29 explicit technique-critical pantry-stage exceptions
- 129 authored component groups across the catalog
- Two to four active ingredient groups per recipe

## Data-model changes

- `data/recipes.js` is the only recipe catalog loaded by the application.
- Legacy detail overlays, prototype overlays, built-in recipe fallbacks, and stage blueprints were removed.
- Every recipe has a revision, stable ingredient/stage/action IDs, explicit stages, authored component order, and structured working ingredients.
- Culinary pantry policy lives in `data/recipe-pantry.js`; canonical ingredient records are validated against it.
- The household grocery catalog is a separate product concept from recipe pantry staples.
- Prepared inputs use backward-only `sourceStageId` relationships.
- Legacy string steps and standalone completion fields are absent from canonical recipe data.
- `data/recipe.schema.json` is strict for recipe, ingredient, stage, action, ingredient-use, and source-link records.

## Editorial checks completed

- Every action has a concise title and a cohesive instruction.
- Completion cues remain inside the action that creates the result.
- Final poultry-cooking actions show 165°F in visible prose.
- No `readyWhen`, `readyLabel`, or separated `Ready when:` content remains.
- Everyday oils, salt, pepper, and water are tagged as pantry staples and omitted from ordinary stage working sets.
- Optional meaning expressed in legacy wording or preferences has been normalized into the structured boolean.
- Ingredient groups are organized by cooking purpose rather than grocery aisle.

## Automated validation

Run:

```sh
npm run validate:recipes
```

The validator checks the strict schema plus unique IDs, ingredient/action relationships, backward-only prepared-component references, component ordering, unused non-staple ingredients, deprecated completion fields, and visible safety-temperature prose.

Final result: 36 recipes, 130 stages, and 302 actions validated with no errors.

## Rendering validation

- All 36 recipes passed at 1440×900.
- All 36 recipes passed at 390×844.
- 180 additional recipe/viewport checks passed at widths 1280, 1024, 820, 760, and 520.
- No tested recipe produced horizontal page overflow.
- Every tested route rendered its expected stages and titled actions.
- Ingredients began collapsed on every desktop and phone route.
- No deprecated method heading, completion footer, floating stage navigation, ingredient shortcut, or ingredient dialog rendered.
- A final post-cleanup phone pass covered all 36 recipes with no console errors.

## Print contract

The print stylesheet expands the complete ingredient details, hides the preview and disclosure control, prints ingredients once, preserves all stages and actions, hides application controls and recipe actions, and applies `break-inside: avoid` to ingredient groups, stages, headings, action rows, and contextual notes.
