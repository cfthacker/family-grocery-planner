# Recipe Batch Template

Copy this into a new chat inside the `Grocery Planner Recipe Builder` ChatGPT Project.

```text
Convert the following recipes into the Weeknight Table recipe import JSON format.

Use `recipe-import.simple.schema.json`, `example-starter-recipes.simple.json`, `recipe-pattern-library.md`, and `ingredient-object-guidance.md`.

Return valid JSON inside a single fenced `json` code block with two-space indentation.

Batch details:
- schemaVersion: 1.0
- source: chatgpt-project-manual-import
- createdAt: YYYY-MM-DD
- servings default: 4 adult-size servings
- mealType default: dinner
- style: repeatable, shortcut-aware, family-scaled dinner system
- household: 2 adults plus 3 young kids

Before writing JSON, decide:
- protein default
- base/starch
- sauce strategy
- vegetable format
- shortcut level
- spice level
- kid-flex move
- what actually needs review

Recipe 1:
Title:
Approximate time:
Servings:
Notes:
Ingredients:
- 
- 
- 
Steps, if known:
- 
- 

Recipe 2:
Title:
Approximate time:
Servings:
Notes:
Ingredients:
- 
- 
- 
Steps, if known:
- 
- 

Recipe 3:
Title:
Approximate time:
Servings:
Notes:
Ingredients:
- 
- 
- 
Steps, if known:
- 
- 

Recipe 4:
Title:
Approximate time:
Servings:
Notes:
Ingredients:
- 
- 
- 
Steps, if known:
- 
- 

Recipe 5:
Title:
Approximate time:
Servings:
Notes:
Ingredients:
- 
- 
- 
Steps, if known:
- 
- 
```

## Follow-Up Prompts

Use this after ChatGPT returns JSON:

```text
Audit this batch against the lean schema and the recipe builder rules.

Check:
- invalid JSON
- missing fields
- household scaling
- shortcut level
- optional ingredients that do not earn their place
- kidFlex that is descriptive instead of operational
- steps missing useful first-time-cook guardrails
- suspicious ingredient mappings
- exact products used as generic ingredients
- weak productSearchTerms
- items that should have needsReview: true

Return a concise issue list first. Do not rewrite the JSON yet.
```

Use this after you make corrections:

```text
Apply these corrections consistently across the batch, then return only the full corrected JSON object.

Corrections:
- 
- 
- 
```

Use this when the batch looks good:

```text
Make this import-ready. Return only the corrected JSON object inside a single fenced `json` code block with two-space indentation.
```
