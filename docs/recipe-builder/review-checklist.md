# Recipe Batch Review Checklist

Use this before accepting a ChatGPT-generated recipe batch.

## JSON Validity

- The JSON copied out of the code block parses cleanly.
- The top-level object has `schemaVersion`, `source`, and `recipes`.
- Every recipe has a stable kebab-case `id`.
- Every recipe includes the lean required fields: `title`, `overview`, `minutes`, `servings`, `base`, `protein`, `tags`, `kidFlex`, `ingredients`, `steps`, `sourceLinks`, `needsReview`, and `notes`.
- If a recipe includes `image`, the file path is relative to the app and the file exists.
- If a recipe includes `image`, it also includes useful `imageAlt`.
- Every ingredient includes `original`, `genericIngredient`, `quantity`, `unit`, `section`, `preferences`, `productSearchTerms`, and `needsReview`.
- Arrays are arrays, not comma-separated strings.
- Booleans are real booleans, not `"true"` or `"false"` strings.

## Weeknight Table Fit

- The recipe is a repeatable family dinner system, not a fussy best-possible version.
- The recipe is scaled to 4 adult-size servings unless there is a reason not to.
- The recipe is a complete dinner by default, with a base or side when useful.
- The recipe has a clear default path, not too many equally weighted alternatives.
- Shortcuts preserve the dish's identity.
- Optional ingredients earn their place.
- The recipe title sounds like something you would recognize later.
- The `overview` explains the dinner without getting long.

## Ingredient Quality

- Every ingredient preserves the generated recipe wording in `original`.
- `genericIngredient` is a grocery category, not an exact store product.
- Brand, format, fat percentage, cut, flavor, and package style live in `preferences`.
- `quantity` and `unit` are useful for shopping.
- `section` is correct enough for grocery grouping.
- `productSearchTerms` would find flexible candidate products.
- Pantry basics are included only when they matter for planning or cooking.

## Needs Review

Use `needsReview: true` for real shopping or execution uncertainty:

- Package size matters.
- Brand or style matters.
- Ingredient has meaningful alternatives.
- Spice level matters.
- Cut or thickness matters.
- Optional ingredient affects shopping.
- Family tolerance is uncertain.

Use `needsReview: false` for clear basics:

- Garlic.
- Butter.
- Oil.
- Eggs.
- Salt and pepper.
- Clear quantities of chicken breast.
- Standard flour dredge.

## Kid-Flex

- `kidFlex` explains what the cook does differently during cooking or serving.
- It does not merely say the dish is kid-friendly.
- It uses practical moves such as sauce on the side, plain portions, mild defaults, separated components, or build-your-own serving.

## Steps

- Steps are useful for a first-time cook.
- Steps include timing, heat level, visual cues, and batch notes where helpful.
- Steps include common failure-prevention details.
- Steps are original wording, not copied from source recipes.
- A normal dinner has about 6 to 10 steps.

## Research Quality

- Source links are present when web research was used.
- Source links support the recipe pattern without being copied.
- The recipe reflects common patterns across sources.
- The recipe preserves essential techniques.
- The recipe simplifies parts that do not define the dish.

## Final Questions

- Is this scaled for the household?
- Is the shortcut level appropriate?
- Are optional ingredients justified?
- Are `needsReview` flags meaningful?
- Is kid-flex operational?
- Are steps useful for a first-time cook?
- Are product search terms grocery-friendly?
- Is the recipe a complete dinner?
- Does the recipe preserve the dish's identity?
