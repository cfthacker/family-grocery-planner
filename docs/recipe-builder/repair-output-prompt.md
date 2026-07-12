# Repair Output Prompt

Use this when ChatGPT gives you a prose recipe, research memo, or partial draft instead of valid JSON.

```text
The previous response was useful research, but it did not follow the required output format.

Repair it now.

Requirements:
- Return only one valid JSON object matching the uploaded schema.
- Put the JSON inside one fenced `json` code block.
- Format the JSON with line breaks and two-space indentation.
- Do not minify the JSON into one line.
- Do not include a prose introduction.
- Do not include any text outside the code block.
- Preserve the useful recipe decisions from the previous response.
- Preserve source names and run web search again to include exact source URLs in `sourceLinks`.
- Do not copy recipe instructions verbatim from any source.
- Rewrite steps in concise original wording.
- Mark uncertain ingredient quantities or mappings with `needsReview: true`.
- Default to 4 adult-size servings unless the recipe has a reason not to.
- Make kidFlex operational.
- Keep ingredients compact and grocery-friendly.
- Include enough step detail for a first-time cook.
- Shortcut the annoying part, not the identity of the meal.

Now return the corrected import JSON only.
```

## Even Stricter Version

Use this if ChatGPT still adds prose:

```text
Return JSON in one fenced `json` code block only. No preface. No notes. No explanation.

Convert the previous response into a single object matching `recipe-import.simple.schema.json`.

If your response contains any text before the opening code fence or after the closing code fence, it is invalid.
```
