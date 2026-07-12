window.WeeknightTableData = window.WeeknightTableData || {};

window.WeeknightTableData.groceryProducts = [
  {
    genericIngredient: "Chicken breasts",
    recommendedProductName: "Boneless Skinless Chicken Breast, ~2.5 lb",
    quantityToBuy: "2.5 lb",
    category: "fresh",
    section: "Protein",
    estimatedCost: 15.5,
    planningValue: "shared ingredient",
    tags: ["protein", "batch cook", "leftovers"],
    recommendationReason: "Works across bowls, wraps, and leftover plates without locking the week into one flavor profile.",
    substitutionRules: {
      preferred: ["FreshDirect boneless skinless chicken breast", "Bell & Evans boneless skinless chicken breast"],
      acceptable: ["boneless skinless chicken thighs"],
      avoid: ["breaded chicken", "pre-marinated chicken", "bone-in chicken", "skin-on chicken"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Ground turkey",
    recommendedProductName: "93% Lean Ground Turkey, 2 lb",
    quantityToBuy: "2 lb",
    category: "fresh",
    section: "Protein",
    estimatedCost: 11.98,
    planningValue: "leftover path",
    tags: ["protein", "taco", "batch cook"],
    recommendationReason: "A lean protein that can become taco skillets, bowls, quesadillas, or pasta sauce.",
    substitutionRules: {
      preferred: ["93% lean ground turkey"],
      acceptable: ["ground chicken", "lean ground beef"],
      avoid: ["seasoned turkey patties", "breakfast sausage"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Salmon fillets",
    recommendedProductName: "Atlantic Salmon Fillets, ~1.5 lb",
    quantityToBuy: "1.5 lb",
    category: "fresh",
    section: "Protein",
    estimatedCost: 19.99,
    planningValue: "single-use",
    tags: ["protein", "fresh first", "fish"],
    recommendationReason: "Best for an early-week dinner where freshness matters and prep stays simple.",
    substitutionRules: {
      acceptable: ["arctic char", "cod fillets"],
      avoid: ["smoked salmon", "breaded frozen fish"]
    },
    confidence: "recommended"
  },
  {
    genericIngredient: "Eggs",
    recommendedProductName: "Large Brown Eggs, 1 dozen",
    quantityToBuy: "1 dozen",
    category: "fresh",
    section: "Dairy",
    estimatedCost: 4.29,
    planningValue: "backup",
    tags: ["breakfast", "backup dinner", "kid friendly"],
    recommendationReason: "Covers breakfast, baking, and backup breakfast-for-dinner plates.",
    substitutionRules: {
      acceptable: ["large white eggs", "organic large eggs"],
      avoid: ["liquid egg whites unless specifically planned"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Greek yogurt",
    recommendedProductName: "Fage 2% Plain Greek Yogurt, 32 oz",
    quantityToBuy: "32 oz",
    category: "fresh",
    section: "Dairy",
    estimatedCost: 5.99,
    planningValue: "shared ingredient",
    tags: ["sauce", "breakfast", "snack"],
    recommendationReason: "Plain Greek yogurt works across ranch sauce, taco crema, marinades, breakfast, and kid sides.",
    substitutionRules: {
      preferred: ["Fage 2% plain Greek yogurt"],
      acceptable: ["Chobani plain Greek yogurt", "FreshDirect plain Greek yogurt"],
      avoid: ["vanilla yogurt", "honey yogurt", "sweetened yogurt", "fruit-on-bottom yogurt"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Cheddar",
    recommendedProductName: "Shredded Sharp Cheddar, 8 oz",
    quantityToBuy: "8 oz",
    category: "fresh",
    section: "Dairy",
    estimatedCost: 4.79,
    planningValue: "shared ingredient",
    tags: ["taco", "wraps", "quesadilla"],
    recommendationReason: "Shredded cheddar works for taco skillets, bowls, wraps, and quesadillas.",
    substitutionRules: {
      preferred: ["shredded sharp cheddar"],
      acceptable: ["Mexican cheese blend", "block cheddar if shredding at home"],
      avoid: ["cheese slices"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Mozzarella",
    recommendedProductName: "Shredded Low-Moisture Mozzarella, 12 oz",
    quantityToBuy: "12 oz",
    category: "fresh",
    section: "Dairy",
    estimatedCost: 5.49,
    planningValue: "shared ingredient",
    tags: ["pizza", "flatbread", "pasta"],
    recommendationReason: "Low-moisture mozzarella melts reliably on flatbreads and backup pasta.",
    substitutionRules: {
      acceptable: ["Italian cheese blend", "fresh mozzarella if using quickly"],
      avoid: ["smoked mozzarella unless planned"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Milk",
    recommendedProductName: "Whole Milk, 1 gallon",
    quantityToBuy: "1 gallon",
    category: "staple",
    section: "Dairy",
    estimatedCost: 4.49,
    planningValue: "staple",
    tags: ["breakfast", "kids", "weekly staple"],
    recommendationReason: "A weekly staple for breakfast, kid drinks, and simple cooking.",
    substitutionRules: {
      acceptable: ["2% milk", "lactose-free milk"],
      avoid: ["flavored milk unless requested"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Rice",
    recommendedProductName: "Long Grain White Rice, 2 lb bag",
    quantityToBuy: "2 lb bag",
    category: "staple",
    section: "Dry Goods",
    estimatedCost: 4.49,
    planningValue: "staple",
    tags: ["bowl base", "leftovers", "pantry"],
    recommendationReason: "A flexible base for rice bowls, taco bowls, leftover plates, and backup meals.",
    substitutionRules: {
      preferred: ["long grain white rice"],
      acceptable: ["jasmine rice", "basmati rice"],
      avoid: ["flavored rice mixes unless planned"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Black beans",
    recommendedProductName: "Black Beans, 15 oz cans, 2 count",
    quantityToBuy: "2 cans",
    category: "staple",
    section: "Dry Goods",
    estimatedCost: 2.98,
    planningValue: "shared ingredient",
    tags: ["taco", "bowls", "pantry"],
    recommendationReason: "Adds protein and bulk to taco skillets, bowls, quesadillas, and backup lunches.",
    substitutionRules: {
      acceptable: ["pinto beans", "kidney beans"],
      avoid: ["seasoned chili beans unless planned"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Pasta",
    recommendedProductName: "Penne or Rotini Pasta, 1 lb",
    quantityToBuy: "1 lb",
    category: "staple",
    section: "Dry Goods",
    estimatedCost: 2.49,
    planningValue: "backup",
    tags: ["backup meal", "pantry", "kid friendly"],
    recommendationReason: "A reliable backup base for turkey meat sauce, pesto pasta, or cheesy broccoli pasta.",
    substitutionRules: {
      acceptable: ["rigatoni", "fusilli", "spaghetti"],
      avoid: ["tiny pasta shapes for baked or sauced dinners"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Marinara",
    recommendedProductName: "Rao's Homemade Marinara Sauce, 24 oz",
    quantityToBuy: "24 oz jar",
    category: "staple",
    section: "Dry Goods",
    estimatedCost: 8.99,
    planningValue: "backup",
    tags: ["pasta", "pizza", "backup"],
    recommendationReason: "A high-quality jarred sauce can rescue pasta, flatbreads, meatballs, and backup dinners.",
    substitutionRules: {
      preferred: ["Rao's marinara"],
      acceptable: ["Victoria marinara", "FreshDirect marinara"],
      avoid: ["sweet pizza sauce for pasta unless planned"]
    },
    confidence: "recommended"
  },
  {
    genericIngredient: "Tortillas",
    recommendedProductName: "10-count Soft Flour Tortillas",
    quantityToBuy: "10 count",
    category: "staple",
    section: "Bakery",
    estimatedCost: 3.99,
    planningValue: "shared ingredient",
    tags: ["wraps", "quesadilla", "kid lunch"],
    recommendationReason: "Flour tortillas work better for wraps, quesadillas, and kid lunches than corn tortillas.",
    substitutionRules: {
      preferred: ["medium flour tortillas"],
      acceptable: ["whole wheat flour tortillas", "soft taco-size flour tortillas"],
      avoid: ["corn tortillas", "hard taco shells", "street-taco tortillas"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Flatbreads",
    recommendedProductName: "Stonefire Naan or Flatbreads, 1 pack",
    quantityToBuy: "1 pack",
    category: "staple",
    section: "Bakery",
    estimatedCost: 5.49,
    planningValue: "backup",
    tags: ["pizza", "leftovers", "kid friendly"],
    recommendationReason: "Turns leftover proteins, sauce, cheese, and vegetables into fast pizza night.",
    substitutionRules: {
      acceptable: ["naan", "pita", "pizza crust"],
      avoid: ["sweet flatbreads"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Sandwich bread",
    recommendedProductName: "Whole Wheat Sandwich Bread, 1 loaf",
    quantityToBuy: "1 loaf",
    category: "staple",
    section: "Bakery",
    estimatedCost: 3.99,
    planningValue: "staple",
    tags: ["kid lunch", "breakfast", "weekly staple"],
    recommendationReason: "Supports breakfasts, sandwiches, toast, and backup kid meals.",
    substitutionRules: {
      acceptable: ["white sandwich bread", "sourdough loaf"],
      avoid: ["sweet breakfast bread unless planned"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Broccoli crowns",
    recommendedProductName: "Broccoli Crowns, 3 count",
    quantityToBuy: "3 crowns",
    category: "fresh",
    section: "Produce",
    estimatedCost: 5.25,
    planningValue: "shared ingredient",
    tags: ["vegetable", "bowls", "pizza"],
    recommendationReason: "Easy to roast or steam once, then reuse as bowl vegetables, pizza toppings, or snack vegetables.",
    substitutionRules: {
      acceptable: ["broccoli florets", "green beans"],
      avoid: ["sauced frozen broccoli"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Lettuce",
    recommendedProductName: "Romaine Hearts or Green Leaf Lettuce, 1 head",
    quantityToBuy: "1 head",
    category: "fresh",
    section: "Produce",
    estimatedCost: 3.49,
    planningValue: "shared ingredient",
    tags: ["wraps", "bowls", "salad"],
    recommendationReason: "Adds crunch to wraps and taco bowls and can become a side salad.",
    substitutionRules: {
      acceptable: ["romaine hearts", "green leaf lettuce", "shredded lettuce"],
      avoid: ["delicate spring mix for warm bowls"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Tomatoes",
    recommendedProductName: "Grape Tomatoes, 1 pint",
    quantityToBuy: "1 pint",
    category: "fresh",
    section: "Produce",
    estimatedCost: 4.99,
    planningValue: "shared ingredient",
    tags: ["bowls", "salad", "pizza"],
    recommendationReason: "Small tomatoes keep well and work across bowls, salads, flatbreads, and kid sides.",
    substitutionRules: {
      acceptable: ["cherry tomatoes", "roma tomatoes"],
      avoid: ["large underripe tomatoes"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Lemons",
    recommendedProductName: "Lemons, 4 count",
    quantityToBuy: "4",
    category: "fresh",
    section: "Produce",
    estimatedCost: 3.49,
    planningValue: "shared ingredient",
    tags: ["marinade", "sauce", "finish"],
    recommendationReason: "Fresh lemons carry marinades, yogurt sauces, dressings, and bright finishes.",
    substitutionRules: {
      acceptable: ["bottled lemon juice in a pinch"],
      avoid: ["sweetened lemonade"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Strawberries",
    recommendedProductName: "Strawberries, 1 lb",
    quantityToBuy: "1 lb",
    category: "fresh",
    section: "Produce",
    estimatedCost: 5.49,
    planningValue: "snack",
    tags: ["snack", "breakfast", "kid friendly"],
    recommendationReason: "Works as a kid snack, breakfast side, and lunchbox fruit.",
    substitutionRules: {
      acceptable: ["blueberries", "grapes", "clementines"],
      avoid: ["overripe berries for late-week use"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Baby carrots",
    recommendedProductName: "Baby Carrots, 1 bag",
    quantityToBuy: "1 bag",
    category: "fresh",
    section: "Produce",
    estimatedCost: 2.99,
    planningValue: "snack",
    tags: ["snack", "kid lunch", "side"],
    recommendationReason: "Reliable raw vegetable for snacks, lunches, and quick sides.",
    substitutionRules: {
      acceptable: ["carrot sticks", "cucumber spears"],
      avoid: ["shredded carrots for snack use"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Corn",
    recommendedProductName: "Frozen Corn, 1 bag",
    quantityToBuy: "1 bag",
    category: "staple",
    section: "Frozen",
    estimatedCost: 2.99,
    planningValue: "backup",
    tags: ["taco", "bowls", "freezer"],
    recommendationReason: "Freezer-friendly vegetable that works in taco skillets, bowls, quesadillas, and backup sides.",
    substitutionRules: {
      acceptable: ["canned corn", "frozen mixed vegetables"],
      avoid: ["creamed corn"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Juice boxes",
    recommendedProductName: "100% Apple Juice Boxes, 10 pack",
    quantityToBuy: "10 pack",
    category: "staple",
    section: "Beverages",
    estimatedCost: 5.99,
    planningValue: "staple",
    tags: ["kid lunch", "snack"],
    recommendationReason: "Covers lunchboxes and outings without affecting the dinner plan.",
    substitutionRules: {
      acceptable: ["water boxes", "low-sugar juice boxes"],
      avoid: ["large bottles if lunchbox portability matters"]
    },
    confidence: "ready"
  },
  {
    genericIngredient: "Snack bars",
    recommendedProductName: "Kid-Friendly Granola Bars, 1 box",
    quantityToBuy: "1 box",
    category: "snack",
    section: "Snacks",
    estimatedCost: 6.99,
    planningValue: "staple",
    tags: ["snack", "lunchbox"],
    recommendationReason: "A shelf-stable snack buffer for lunches and after-school gaps.",
    substitutionRules: {
      acceptable: ["fig bars", "protein bars", "fruit bars"],
      avoid: ["high-caffeine bars", "messy chocolate-coated bars for lunchboxes"]
    },
    confidence: "recommended"
  }
];
