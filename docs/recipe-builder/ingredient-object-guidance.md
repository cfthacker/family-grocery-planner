# Ingredient Object Guidance

Use this when deciding how to fill ingredient fields in the lean recipe schema.

## Field Meanings

- Recipe-level `image`: Optional relative path to an image stored in the app, usually under `assets/recipes/`.
- Recipe-level `imageAlt`: Optional accessible description of the image.
- `original`: Natural recipe wording. This should sound like the cook-facing ingredient.
- `genericIngredient`: Broad grocery category, not an exact store product.
- `quantity`: Useful amount for the recipe or shopping plan.
- `unit`: Simple unit such as `lb`, `oz`, `cup`, `tbsp`, `bag`, `packet`, `kit`, `count`, or an empty string.
- `section`: Grocery section.
- `preferences`: Shopping or cooking constraints that matter.
- `productSearchTerms`: Flexible searches likely to find good products.
- `needsReview`: Meaningful uncertainty only.

## Good Examples

```json
{
  "original": "1/4 cup bottled soy-garlic-ginger stir-fry sauce, plus more to taste",
  "genericIngredient": "Bottled stir-fry sauce",
  "quantity": 0.25,
  "unit": "cup",
  "section": "Dry Goods",
  "preferences": ["soy-garlic-ginger style", "not spicy", "use less at first"],
  "productSearchTerms": ["stir fry sauce", "soy garlic ginger stir fry sauce"],
  "needsReview": true
}
```

```json
{
  "original": "1 lb ground beef, 85% to 90% lean",
  "genericIngredient": "Ground beef",
  "quantity": 1,
  "unit": "lb",
  "section": "Protein",
  "preferences": ["85% to 90% lean"],
  "productSearchTerms": ["ground beef 85 lean", "ground beef 90 lean"],
  "needsReview": false
}
```

## Product Matching Principle

Do not hardcode one store product as the ingredient.

Good:

- `genericIngredient`: `Bottled stir-fry sauce`
- `preferences`: `soy-garlic-ginger style`, `not spicy`
- `productSearchTerms`: `stir fry sauce`, `soy garlic ginger stir fry sauce`

Avoid:

- `genericIngredient`: `Kikkoman Stir-Fry Sauce`

Exact products can be chosen later by the grocery catalog.

## Optional Ingredients

Include optional ingredients only when they represent a real cooking or shopping choice.

Good optional ingredients:

- Wine for piccata.
- Spicy sausage.
- Steak rub.
- Ginger.
- Parsley.
- Guacamole.
- Chicken broth backup.

Weak optional ingredients:

- Fresh herbs that do not change the dish.
- Garnishes that add shopping burden.
- Niche ingredients that make a family recipe less repeatable.
