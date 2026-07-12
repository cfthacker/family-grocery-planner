# Web Research Recipe Template

Copy this into a new chat inside the `Grocery Planner Recipe Builder` ChatGPT Project when you want ChatGPT to use web search to help fill in a recipe.

```text
Research and build a Weeknight Table recipe import JSON object for this recipe idea.

Use web search to compare multiple relevant recipes or cooking references.

Important rules:
- Do not copy a full recipe from any source.
- Do not copy source instructions verbatim.
- Synthesize common patterns across sources.
- Cite the source links used in research.sourceLinks.
- Use practical family-weeknight assumptions.
- Preserve my known requirements.
- Do not invent exact store products, prices, SKUs, or package URLs.
- Return only valid JSON matching the uploaded schema.
- Do not include a prose introduction.
- Do not include a recipe write-up outside the JSON.
- Do not use Markdown fences.
- If you cannot include source URLs, run web search again before answering.
- The first character of your response must be `{` and the last character must be `}`.

Recipe idea:
Title:

Known requirements:
- 
- 
- 

Household/defaults:
- Servings: 5
- Meal type: dinner
- Preference: weeknight practical
- Kid flexibility: components can be separated when useful

What I need you to infer:
- Missing ingredients
- Reasonable quantities
- Practical cooking steps
- Optional ingredients
- Grocery-planning ingredient normalization
- Product search terms and avoid rules
- Review flags for uncertain choices

Before producing final JSON, think through the research privately. In the JSON, summarize:
- common source patterns in research.commonPatterns
- assumptions in research.assumptions
- source links in research.sourceLinks
```

## Buffalo Chicken Wrap Starter

Use this filled-in version for the Buffalo Chicken Wraps idea:

```text
Research and build a Weeknight Table recipe import JSON object for this recipe idea.

Use web search to compare multiple relevant Buffalo chicken wrap recipes or cooking references.

Important rules:
- Do not copy a full recipe from any source.
- Do not copy source instructions verbatim.
- Synthesize common patterns across sources.
- Cite the source links used in research.sourceLinks.
- Use practical family-weeknight assumptions.
- Preserve my known requirements.
- Do not invent exact store products, prices, SKUs, or package URLs.
- Return only valid JSON matching the uploaded schema.
- Do not include a prose introduction.
- Do not include a recipe write-up outside the JSON.
- Do not use Markdown fences.
- If you cannot include source URLs, run web search again before answering.
- The first character of your response must be `{` and the last character must be `}`.

Recipe idea:
Title: Buffalo Chicken Wraps

Known requirements:
- Frank's buffalo sauce
- blue cheese crumbles
- family weeknight dinner

Household/defaults:
- Servings: 5
- Meal type: dinner
- Preference: weeknight practical
- Kid flexibility: let kids choose less sauce or separate chicken, wrap, lettuce, and cheese

What I need you to infer:
- Missing ingredients
- Reasonable quantities
- Practical cooking steps
- Optional ingredients
- Grocery-planning ingredient normalization
- Product search terms and avoid rules
- Review flags for uncertain choices

Before producing final JSON, think through the research privately. In the JSON, summarize:
- common source patterns in research.commonPatterns
- assumptions in research.assumptions
- source links in research.sourceLinks
```
