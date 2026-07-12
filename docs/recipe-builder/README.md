# Recipe Builder Kit

This folder is a copy/paste kit for using ChatGPT as a recipe normalization workbench before importing recipes into Weeknight Table.

Start with the lean files. The richer files are useful as references, but they produce very large JSON and are more than the app needs right now.

## Recommended Lean Setup

1. Create a ChatGPT Project named `Grocery Planner Recipe Builder`.
2. Paste `chatgpt-project-instructions.simple.md` into the Project instructions.
3. Upload these files to the Project:
   - `recipe-import.simple.schema.json`
   - `example-beef-tacos.simple.json`
   - `example-chicken-piccata.simple.json`
   - `example-starter-recipes.simple.json`
   - `recipe-pattern-library.md`
   - `ingredient-object-guidance.md`
4. Use these as copy/paste prompts:
   - `web-research-template.simple.md` when ChatGPT should research a recipe idea.
   - `batch-template.md` when you already know the recipes and ingredients.
   - `scale-workflow.md` when you want to build many recipes in controlled batches.
5. Review the JSON. Correct ingredient mappings that look wrong.

## Why Lean First

The goal is to capture enough data to make grocery planning work:

- recipe identity
- rough time and servings
- generic ingredients
- quantities
- grocery sections
- product search terms
- source links when web research was used
- review flags

Anything beyond that can be added later after we see what the app actually uses.

## Advanced Setup

1. Create a ChatGPT Project named `Grocery Planner Recipe Builder`.
2. Paste the contents of `chatgpt-project-instructions.md` into the Project instructions.
3. Upload these files to the Project:
   - `recipe-import.schema.json`
   - `example-beef-tacos.json`
   - `batch-template.md`
   - `web-research-template.md`
   - `repair-output-prompt.md`
4. Start a new chat inside the Project for each batch of recipes.
5. Paste the contents of `batch-template.md`, fill in 5 recipes, and ask ChatGPT to convert them.
6. For recipe ideas that need outside help, paste `web-research-template.md` and fill in the known requirements.
7. Review the JSON. Correct any ingredient mappings that look wrong.
8. Save the final JSON as a recipe batch for future import.

## File Guide

- `chatgpt-project-instructions.simple.md`: Recommended lean Project instructions.
- `recipe-import.simple.schema.json`: Recommended lean JSON schema.
- `example-beef-tacos.simple.json`: Recommended lean example.
- `example-chicken-piccata.simple.json`: Recommended lean researched-recipe example.
- `example-starter-recipes.simple.json`: Two-recipe example batch with beef tacos and chicken piccata.
- `web-research-template.simple.md`: Recommended lean web research prompt.
- `scale-workflow.md`: Recommended workflow and prompts for scaling to many common dinners.
- `recipe-pattern-library.md`: Reusable recipe patterns from the first five imports.
- `ingredient-object-guidance.md`: Field-by-field guidance for ingredient objects.
- `chatgpt-project-instructions.md`: Permanent instructions for the ChatGPT Project.
- `recipe-import.schema.json`: The structured JSON contract for recipe batches.
- `example-beef-tacos.json`: A completed example using your beef tacos recipe.
- `batch-template.md`: A copy/paste worksheet for entering the first 5 recipes.
- `web-research-template.md`: A copy/paste prompt for asking ChatGPT to research, synthesize, cite sources, and then produce JSON.
- `repair-output-prompt.md`: A copy/paste prompt for converting a prose answer into schema-valid JSON.
- `review-checklist.md`: A checklist to run before accepting a generated batch.

## Core Principle

Recipes should describe generic grocery needs, not exact store products.

Good:

```json
{
  "genericIngredient": "Ground beef",
  "preferences": ["85% lean"],
  "productSearchTerms": ["85% lean ground beef", "ground beef 1 lb"]
}
```

Avoid:

```json
{
  "genericIngredient": "FreshDirect 85% Lean Ground Beef"
}
```

Exact products can be matched later by the grocery catalog. This recipe layer should preserve your original wording and produce clean planning data.
