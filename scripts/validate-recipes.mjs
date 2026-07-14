import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "data", "recipes.js"), "utf8");
const start = source.indexOf("[");
const end = source.lastIndexOf("]");

if (start < 0 || end < start) throw new Error("Could not locate the recipe array in data/recipes.js.");

const recipes = JSON.parse(source.slice(start, end + 1));
const recipeSchema = JSON.parse(fs.readFileSync(path.join(root, "data", "recipe.schema.json"), "utf8"));
const pantrySource = fs.readFileSync(path.join(root, "data", "recipe-pantry.js"), "utf8");
const pantryNames = JSON.parse(pantrySource.slice(pantrySource.indexOf("["), pantrySource.lastIndexOf("]") + 1));
const normalizeIngredient = (value) => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();
const pantryKeys = new Set(pantryNames.map(normalizeIngredient));
const errors = [];
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const duplicateValues = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const addError = (recipeId, message) => errors.push(`${recipeId}: ${message}`);

const resolveRef = (ref) => ref.slice(2).split("/").reduce((value, key) => value[key], recipeSchema);
const typeMatches = (value, type) => ({
  null: value === null,
  array: Array.isArray(value),
  object: value !== null && typeof value === "object" && !Array.isArray(value),
  string: typeof value === "string",
  number: typeof value === "number" && Number.isFinite(value),
  integer: Number.isInteger(value),
  boolean: typeof value === "boolean"
})[type];

function schemaErrors(value, schema, valuePath = "recipe") {
  if (schema.$ref) return schemaErrors(value, resolveRef(schema.$ref), valuePath);
  if (schema.oneOf) {
    const matches = schema.oneOf.filter((candidate) => schemaErrors(value, candidate, valuePath).length === 0);
    return matches.length === 1 ? [] : [`${valuePath} must match exactly one allowed shape`];
  }
  if (schema.anyOf) {
    return schema.anyOf.some((candidate) => schemaErrors(value, candidate, valuePath).length === 0)
      ? []
      : [`${valuePath} does not match an allowed shape`];
  }

  const allowedTypes = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  if (allowedTypes.length && !allowedTypes.some((type) => typeMatches(value, type))) {
    return [`${valuePath} must be ${allowedTypes.join(" or ")}`];
  }

  const found = [];
  if (schema.enum && !schema.enum.includes(value)) found.push(`${valuePath} must be one of ${schema.enum.join(", ")}`);
  if (typeof value === "string") {
    if (schema.minLength != null && value.length < schema.minLength) found.push(`${valuePath} is too short`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) found.push(`${valuePath} has an invalid format`);
    if (schema.format === "uri") {
      try { new URL(value); } catch { found.push(`${valuePath} must be a valid URI`); }
    }
  }
  if (typeof value === "number") {
    if (schema.minimum != null && value < schema.minimum) found.push(`${valuePath} is below ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) found.push(`${valuePath} is above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) found.push(`${valuePath} needs at least ${schema.minItems} items`);
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) found.push(`${valuePath} contains duplicates`);
    if (schema.items) value.forEach((item, index) => found.push(...schemaErrors(item, schema.items, `${valuePath}[${index}]`)));
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    (schema.required || []).forEach((key) => {
      if (!Object.hasOwn(value, key)) found.push(`${valuePath}.${key} is required`);
    });
    Object.entries(value).forEach(([key, child]) => {
      if (schema.properties?.[key]) found.push(...schemaErrors(child, schema.properties[key], `${valuePath}.${key}`));
      else if (schema.additionalProperties === false) found.push(`${valuePath}.${key} is not allowed`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") found.push(...schemaErrors(child, schema.additionalProperties, `${valuePath}.${key}`));
    });
  }
  return found;
}

const recipeIds = recipes.map((recipe) => recipe.id);
duplicateValues(recipeIds).forEach((id) => addError(id, "duplicate recipe ID"));

recipes.forEach((recipe) => {
  schemaErrors(recipe, recipeSchema).forEach((message) => addError(recipe.id || "<missing-id>", message));
  if (!kebabCase.test(recipe.id || "")) addError(recipe.id || "<missing-id>", "invalid recipe ID");
  if (!Number.isInteger(recipe.revision) || recipe.revision < 1) addError(recipe.id, "revision must be a positive integer");
  if (!recipe.overview?.trim()) addError(recipe.id, "missing overview");
  if (!Array.isArray(recipe.ingredientDetails) || !recipe.ingredientDetails.length) addError(recipe.id, "missing ingredient details");
  if (!Array.isArray(recipe.ingredientComponentOrder) || !recipe.ingredientComponentOrder.length) addError(recipe.id, "missing component order");
  if (!Array.isArray(recipe.stages) || recipe.stages.length < 2) addError(recipe.id, "must contain at least two stages");

  const ingredients = recipe.ingredientDetails || [];
  const ingredientIds = ingredients.map((ingredient) => ingredient.id);
  const ingredientIdSet = new Set(ingredientIds);
  duplicateValues(ingredientIds).forEach((id) => addError(recipe.id, `duplicate ingredient ID: ${id}`));
  ingredients.forEach((ingredient) => {
    if (!kebabCase.test(ingredient.id || "")) addError(recipe.id, `invalid ingredient ID: ${ingredient.id}`);
    if (!ingredient.component?.trim()) addError(recipe.id, `ingredient ${ingredient.id} has no component`);
    if (typeof ingredient.optional !== "boolean") addError(recipe.id, `ingredient ${ingredient.id} is missing optional status`);
    if (typeof ingredient.pantryStaple !== "boolean") addError(recipe.id, `ingredient ${ingredient.id} is missing pantry-staple status`);
    if (ingredient.pantryStaple !== pantryKeys.has(normalizeIngredient(ingredient.genericIngredient))) {
      addError(recipe.id, `ingredient ${ingredient.id} disagrees with the recipe pantry policy`);
    }
    if (!recipe.ingredientComponentOrder.includes(ingredient.component)) addError(recipe.id, `component is absent from order: ${ingredient.component}`);
  });

  const stageIds = (recipe.stages || []).map((stage) => stage.id);
  duplicateValues(stageIds).forEach((id) => addError(recipe.id, `duplicate stage ID: ${id}`));
  const actionIds = (recipe.stages || []).flatMap((stage) => (stage.actions || []).map((action) => action.id));
  duplicateValues(actionIds).forEach((id) => addError(recipe.id, `duplicate action ID: ${id}`));
  const usedIngredientIds = new Set();

  (recipe.stages || []).forEach((stage, stageIndex) => {
    if (!kebabCase.test(stage.id || "")) addError(recipe.id, `invalid stage ID: ${stage.id}`);
    if (!stage.title?.trim()) addError(recipe.id, `stage ${stage.id} has no title`);
    if (!Number.isFinite(stage.durationMinutes) || stage.durationMinutes < 0) addError(recipe.id, `stage ${stage.id} has invalid duration`);
    if (!Array.isArray(stage.actions) || !stage.actions.length) addError(recipe.id, `stage ${stage.id} has no actions`);
    if (Object.hasOwn(stage, "readyWhen") || Object.hasOwn(stage, "readyLabel")) addError(recipe.id, `stage ${stage.id} uses a deprecated completion field`);

    (stage.ingredientUses || []).forEach((use) => {
      if (use.ingredientId) {
        usedIngredientIds.add(use.ingredientId);
        if (!ingredientIdSet.has(use.ingredientId)) addError(recipe.id, `stage ${stage.id} references missing ingredient ${use.ingredientId}`);
        const ingredient = ingredients.find((item) => item.id === use.ingredientId);
        if (ingredient?.pantryStaple && use.showIfPantry !== true) {
          addError(recipe.id, `stage ${stage.id} includes pantry staple ${use.ingredientId} without an explicit technique exception`);
        }
        if (!ingredient?.pantryStaple && use.showIfPantry === true) {
          addError(recipe.id, `stage ${stage.id} marks non-pantry ingredient ${use.ingredientId} as a pantry exception`);
        }
      }
      if (use.sourceStageId) {
        const sourceIndex = stageIds.indexOf(use.sourceStageId);
        if (sourceIndex < 0) addError(recipe.id, `stage ${stage.id} references missing source stage ${use.sourceStageId}`);
        if (sourceIndex >= stageIndex) addError(recipe.id, `stage ${stage.id} source stage must come earlier: ${use.sourceStageId}`);
      }
    });

    (stage.actions || []).forEach((action) => {
      if (!kebabCase.test(action.id || "")) addError(recipe.id, `invalid action ID: ${action.id}`);
      if (!action.title?.trim()) addError(recipe.id, `action ${action.id} has no title`);
      if (!action.instruction?.trim()) addError(recipe.id, `action ${action.id} has no instruction`);
      if (/\bready when\s*:/i.test(action.instruction || "")) addError(recipe.id, `action ${action.id} contains a separated Ready when label`);
      (action.ingredientRefs || []).forEach((id) => {
        usedIngredientIds.add(id);
        if (!ingredientIdSet.has(id)) addError(recipe.id, `action ${action.id} references missing ingredient ${id}`);
      });
      if (action.safetyTemperatureF && !new RegExp(`\\b${action.safetyTemperatureF}\\b`).test(action.instruction)) {
        addError(recipe.id, `action ${action.id} does not show its ${action.safetyTemperatureF} F safety temperature`);
      }
    });
  });

  ingredients
    .filter((ingredient) => !ingredient.pantryStaple && !usedIngredientIds.has(ingredient.id))
    .forEach((ingredient) => addError(recipe.id, `unused ingredient: ${ingredient.id}`));
});

if (errors.length) throw new Error(`Recipe validation failed with ${errors.length} error(s):\n${errors.join("\n")}`);

console.log(`Validated ${recipes.length} recipes, ${recipes.reduce((count, recipe) => count + recipe.stages.length, 0)} stages, and ${recipes.reduce((count, recipe) => count + recipe.stages.reduce((stageCount, stage) => stageCount + stage.actions.length, 0), 0)} actions.`);
