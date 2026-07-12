# Lean Web Research Recipe Template

Copy this into a ChatGPT Project chat when you want research help without a giant recipe document.

```text
Research and build a compact Weeknight Table recipe JSON object.

Use web search to compare multiple relevant recipes or cooking references.

Rules:
- Return only valid JSON matching recipe-import.simple.schema.json.
- Return the JSON inside one fenced `json` code block.
- Format the JSON with line breaks and two-space indentation.
- Do not minify the JSON into one line.
- No prose intro or explanation outside the code block.
- The first non-whitespace text must be ```json and the last non-whitespace text must be ```.
- The JSON itself must still be valid if copied out of the code block.
- Do not copy a full recipe from any source.
- Do not copy source instructions verbatim.
- Synthesize common patterns into a practical family weeknight version.
- Include source URLs in sourceLinks.
- Do not invent exact store products, prices, SKUs, or package URLs.
- Default to 4 adult-size servings for 2 adults plus 3 young kids unless I say otherwise.
- Choose the Weeknight Table version before writing JSON: protein, base, sauce, vegetable, shortcut level, spice level, kid-flex, and serving scale.
- Shortcut the annoying part, not the identity of the meal.
- Keep ingredients compact. Steps should be detailed enough for a first-time cook.
- Use 6 to 10 cooking steps with timing, heat level, and visual cues when helpful.
- Include kidFlex with a practical way to serve the meal to kids without making a separate dinner.
- Do not include long research notes.

Shortcut scan:
- Can a bottled sauce work?
- Can a frozen or microwave base work?
- Can frozen vegetables work?
- Can a kit or packet make this more realistic?
- Which shortcuts preserve the dish, and which damage it?

Decision checkpoints:
- Protein
- Base/starch
- Sauce
- Vegetable
- Shortcut level
- Spice level
- Kid-flex
- Serving scale

Recipe idea:
Title:

Known requirements:
-
-
-

Defaults:
- Servings: 4 adult-size servings
- Meal type: dinner
- Style: weeknight practical

Infer:
- missing ingredients
- reasonable quantities
- useful first-time-cook steps
- generic grocery ingredient names
- productSearchTerms
- needsReview flags
- kidFlex
- a complete dinner base or side when the dish is usually just a main
```

## Buffalo Chicken Wrap Starter

```text
Research and build a compact Weeknight Table recipe JSON object.

Use web search to compare multiple relevant Buffalo chicken wrap recipes or cooking references.

Rules:
- Return only valid JSON matching recipe-import.simple.schema.json.
- Return the JSON inside one fenced `json` code block.
- Format the JSON with line breaks and two-space indentation.
- Do not minify the JSON into one line.
- No prose intro or explanation outside the code block.
- The first non-whitespace text must be ```json and the last non-whitespace text must be ```.
- The JSON itself must still be valid if copied out of the code block.
- Do not copy a full recipe from any source.
- Do not copy source instructions verbatim.
- Synthesize common patterns into a practical family weeknight version.
- Include source URLs in sourceLinks.
- Do not invent exact store products, prices, SKUs, or package URLs.
- Default to 4 adult-size servings for 2 adults plus 3 young kids unless I say otherwise.
- Choose the Weeknight Table version before writing JSON: protein, base, sauce, vegetable, shortcut level, spice level, kid-flex, and serving scale.
- Shortcut the annoying part, not the identity of the meal.
- Keep ingredients compact. Steps should be detailed enough for a first-time cook.
- Use 6 to 10 cooking steps with timing, heat level, and visual cues when helpful.
- Include kidFlex with a practical way to serve the meal to kids without making a separate dinner.
- Do not include long research notes.

Shortcut scan:
- Can a bottled sauce work?
- Can a frozen or microwave base work?
- Can frozen vegetables work?
- Can a kit or packet make this more realistic?
- Which shortcuts preserve the dish, and which damage it?

Decision checkpoints:
- Protein
- Base/starch
- Sauce
- Vegetable
- Shortcut level
- Spice level
- Kid-flex
- Serving scale

Recipe idea:
Title: Buffalo Chicken Wraps

Known requirements:
- Frank's buffalo sauce
- blue cheese crumbles
- family weeknight dinner

Defaults:
- Servings: 4 adult-size servings
- Meal type: dinner
- Style: weeknight practical
- Kid flexibility: let kids choose less sauce or separate chicken, wrap, lettuce, and cheese

Infer:
- missing ingredients
- reasonable quantities
- useful first-time-cook steps
- generic grocery ingredient names
- productSearchTerms
- needsReview flags
- kidFlex
- a complete dinner base or side when the dish is usually just a main
```
