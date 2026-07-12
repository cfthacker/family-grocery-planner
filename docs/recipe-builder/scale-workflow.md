# Scaling The Recipe Library

Use this when you want ChatGPT to help build many common family dinners without turning the process into an uncontrolled web-scraping project.

## Best Division Of Labor

Use ChatGPT for:

- brainstorming common dinner categories
- web research and source-backed recipe synthesis
- filling in missing ingredients and practical steps
- producing JSON in the simple schema

Use Codex for:

- validating JSON files
- simplifying or repairing output
- deduplicating recipes and ingredients
- importing recipe JSON into the local app
- building UI and storage features

Do not use an open-ended loop that searches the web and imports everything automatically. Keep a human review step between research and import.

## Recommended Batch Size

Work in batches of 5 recipes.

That is large enough to make progress, but small enough that you can still catch weird ingredient mappings, bland recipes, duplicate ideas, or kid-unfriendly choices.

## Stage 1: Build A Candidate Dinner List

Paste this into the ChatGPT Project:

```text
Help me build a candidate list of common family dinners for Weeknight Table.

Do not produce recipe JSON yet.

Create 50 dinner ideas grouped by category:
- tacos, wraps, and quesadillas
- chicken dinners
- beef dinners
- turkey dinners
- pasta dinners
- rice bowls
- sheet pan dinners
- skillet dinners
- soups and stews
- vegetarian backups
- kid-friendly flexible meals

For each idea, include:
- title
- protein
- base
- why it belongs in a family grocery planner
- likely shortcut strategy
- likely kid-flex move
- whether it should use web research before import

Favor practical weeknight dinners for 2 adults and 3 young kids, scaled as about 4 adult-size servings.
Avoid overly fussy, expensive, or niche recipes.
Prefer repeatable, grocery-planning-friendly dinner systems over best-possible restaurant versions.
```

Review the list manually. Pick the 5 that feel most useful.

## Stage 2: Research 5 Recipes

Paste this into the ChatGPT Project after choosing the first 5:

```text
Research and build compact Weeknight Table recipe JSON for these 5 recipes.

Use web search where useful.

Rules:
- Return only valid JSON matching recipe-import.simple.schema.json.
- Return the JSON inside one fenced `json` code block.
- Format the JSON with line breaks and two-space indentation.
- Do not minify the JSON into one line.
- No prose intro or explanation outside the code block.
- Do not copy a full recipe from any source.
- Do not copy source instructions verbatim.
- Synthesize common patterns into practical family weeknight versions.
- Include source URLs in sourceLinks for recipes that used web research.
- Do not invent exact store products, prices, SKUs, or package URLs.
- Choose the Weeknight Table version before writing JSON: protein, base, sauce, vegetable, shortcut level, spice level, kid-flex, and serving scale.
- Shortcut the annoying part, not the identity of the meal.
- Keep ingredients compact.
- Steps should be detailed enough for a first-time cook.
- Include kidFlex for every dinner.
- Use needsReview where quantities, product choices, or mappings are uncertain.

Defaults:
- Servings: 4 adult-size servings
- Meal type: dinner
- Style: weeknight practical

Recipes:
1. 
2. 
3. 
4. 
5. 
```

## Stage 3: Audit The Batch

Paste this after ChatGPT returns JSON:

```text
Audit this batch.

Check for:
- invalid JSON
- missing required schema fields
- sourceLinks missing from web-researched recipes
- copied or overly source-like recipe steps
- genericIngredient values that are actually exact products
- vague quantities that should have needsReview: true
- weak productSearchTerms
- kidFlex that is too generic
- duplicate ingredients that should be normalized consistently
- optional ingredients that do not earn their place
- shortcuts that damage the dish identity
- recipes that are not complete dinners

Return a concise list of issues first.
Do not rewrite the JSON yet.
```

Then correct the issues:

```text
Apply these corrections and return only the full corrected JSON object.

Corrections:
-
-
-
```

## Stage 4: Hand Off To Codex

Once you have JSON you like, give it to Codex and ask:

```text
Validate this recipe batch against recipe-import.simple.schema.json, simplify anything overly verbose, and save it as a local import file.
```

After that, Codex can build the importer that brings those recipes into the planner.

## What To Avoid

- Do not ask ChatGPT to make 100 complete recipes in one response.
- Do not import researched recipes without reviewing them.
- Do not let exact store products become `genericIngredient` values.
- Do not let source recipes be copied into your planner.
- Do not optimize for maximum recipe count before the first 20 recipes feel genuinely useful.
