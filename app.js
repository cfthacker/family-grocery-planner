const recipePantryStaples = window.WeeknightTableData?.recipePantryStaples || [];
const recipePantryStapleKeys = new Set(recipePantryStaples.map(normalKey));

const sectionOrder = ["Protein", "Produce", "Dairy", "Bakery", "Dry Goods", "Frozen", "Baking", "Spices", "Deli", "Snacks", "Beverages", "Household", "Other"];
const shelfStableSections = new Set(["Dry Goods", "Pantry", "Spices", "Baking", "Frozen", "Snacks", "Beverages", "Household"]);
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const productCatalog = window.WeeknightTableData?.groceryProducts || [];
const catalogByIngredient = new Map(productCatalog.map((product) => [normalKey(product.genericIngredient), product]));
const storageKey = "weeknight-table-planner-v1";
const recipeLibrary = (window.WeeknightTableData?.recipes || []).map(normalizeRecipeRecord);
const recipeById = new Map(recipeLibrary.map((recipe) => [recipe.id, recipe]));
const weeks = buildWeeks();
let state = loadState();
let recipeSearchText = "";
let sectionFilter = "all";
let recipePickDayIndex = null;
let recipeVisibleCount = 12;
let recipeSortMode = "recommended";
let recipeViewMode = "list";
let activeRecipeCollection = "";
let activeRecipeId = "";
let recipeReturnView = "recipes";
let recipeReturnScroll = 0;
let recipeCanGoBack = false;
let recipeReturnFocus = null;
const recipeFacets = {
  time: "all",
  protein: "all",
  format: "all",
  base: "all",
  cuisine: "all",
  equipment: "all",
  effort: "all",
  kidFriendly: false,
  leftovers: false,
  pantry: false,
  added: false,
  lowCleanup: false,
  notRecent: false,
  favorite: false,
  recentlyCooked: false,
  freezerFriendly: false
};

const els = {
  weekTitle: document.querySelector("#weekTitle"),
  weekTabs: document.querySelector("#weekTabs"),
  weekStats: document.querySelector("#weekStats"),
  unscheduledTray: document.querySelector("#unscheduledTray"),
  daySlots: document.querySelector("#daySlots"),
  deliverySummary: document.querySelector("#deliverySummary"),
  deliveryPreview: document.querySelector("#deliveryPreview"),
  recipeSearch: document.querySelector("#recipeSearch"),
  recommendedGrid: document.querySelector("#recommendedGrid"),
  recipeResultCount: document.querySelector("#recipeResultCount"),
  recipeSort: document.querySelector("#recipeSort"),
  recipeGrid: document.querySelector("#recipeGrid"),
  loadMoreRecipes: document.querySelector("#loadMoreRecipes"),
  recipeDetail: document.querySelector("#recipeDetail"),
  groceryHeading: document.querySelector("#groceryHeading"),
  groceryDeliveries: document.querySelector("#groceryDeliveries"),
  ingredientCatalog: document.querySelector("#ingredientCatalog"),
  pantryTags: document.querySelector("#pantryTags")
};

renderAll();
syncRecipeRoute({ initial: true });

document.querySelector("#printBtn").addEventListener("click", () => window.print());

document.querySelectorAll("[data-view-button]").forEach((button) => {
  button.addEventListener("click", () => navigateToView(button.dataset.viewButton));
});

document.querySelectorAll("[data-view-jump]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToView(button.dataset.viewJump);
  });
});

window.addEventListener("popstate", () => syncRecipeRoute());

els.recipeSearch?.addEventListener("input", () => {
  recipeSearchText = els.recipeSearch.value.trim().toLowerCase();
  clearActiveCollection();
  recipeVisibleCount = 12;
  renderRecipes();
});

document.querySelectorAll("[data-recipe-facet]").forEach((control) => {
  control.addEventListener("change", () => {
    recipeFacets[control.dataset.recipeFacet] = control.value;
    clearActiveCollection();
    recipeVisibleCount = 12;
    renderRecipes();
  });
});

document.querySelectorAll("[data-recipe-flag]").forEach((control) => {
  control.addEventListener("change", () => {
    recipeFacets[control.dataset.recipeFlag] = control.checked;
    clearActiveCollection();
    recipeVisibleCount = 12;
    renderRecipes();
  });
});

els.recipeSort?.addEventListener("change", () => {
  recipeSortMode = els.recipeSort.value;
  clearActiveCollection();
  renderRecipes();
});

document.querySelectorAll("[data-section-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    sectionFilter = button.dataset.sectionFilter;
    document.querySelectorAll("[data-section-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderGroceries();
  });
});

document.addEventListener("click", (event) => {
  const ingredientToggle = event.target.closest("[data-toggle-recipe-ingredients]");
  if (ingredientToggle) {
    toggleRecipeIngredientOverview(ingredientToggle);
    return;
  }

  const weekButton = event.target.closest("[data-week-key]");
  if (weekButton) {
    state.activeWeek = weekButton.dataset.weekKey;
    ensurePlan(state.activeWeek);
    saveState();
    renderAll();
    return;
  }

  const weekShiftButton = event.target.closest("[data-week-shift]");
  if (weekShiftButton) {
    shiftWeek(Number(weekShiftButton.dataset.weekShift));
    return;
  }

  const addRecipeButton = event.target.closest("[data-add-recipe]");
  if (addRecipeButton) {
    chooseRecipe(addRecipeButton.dataset.addRecipe);
    return;
  }

  const ratingButton = event.target.closest("[data-rate-recipe]");
  if (ratingButton) {
    rateRecipe(ratingButton.dataset.rateRecipe, Number(ratingButton.dataset.rating));
    return;
  }

  const collectionButton = event.target.closest("[data-recipe-collection]");
  if (collectionButton) {
    applyRecipeCollection(collectionButton.dataset.recipeCollection);
    document.querySelectorAll("[data-recipe-collection]").forEach((button) => button.classList.toggle("active", button === collectionButton));
    return;
  }

  const viewModeButton = event.target.closest("[data-recipe-view]");
  if (viewModeButton) {
    recipeViewMode = viewModeButton.dataset.recipeView;
    document.querySelectorAll("[data-recipe-view]").forEach((button) => button.classList.toggle("active", button === viewModeButton));
    renderRecipes();
    return;
  }

  if (event.target.closest("#loadMoreRecipes")) {
    recipeVisibleCount += 12;
    renderRecipes();
    return;
  }

  if (event.target.closest("#clearRecipeFilters")) {
    clearRecipeFilters();
    return;
  }

  const openRecipePickerButton = event.target.closest("[data-open-recipe-picker]");
  if (openRecipePickerButton) {
    recipePickDayIndex = Number(openRecipePickerButton.dataset.openRecipePicker);
    navigateToView("recipes");
    renderRecipes();
    return;
  }

  if (event.target.closest("[data-close-recipe]")) {
    closeRecipeDetail();
    return;
  }

  if (event.target.closest("[data-print-recipe]")) {
    window.print();
    return;
  }

  const removeDayButton = event.target.closest("[data-remove-day]");
  if (removeDayButton) {
    removeRecipeFromDay(Number(removeDayButton.dataset.removeDay));
    return;
  }

  const removeUnscheduledButton = event.target.closest("[data-remove-unscheduled]");
  if (removeUnscheduledButton) {
    removeUnscheduledRecipe(removeUnscheduledButton.dataset.removeUnscheduled);
    return;
  }

  const viewRecipeButton = event.target.closest("[data-view-recipe]");
  if (viewRecipeButton) {
    viewRecipe(viewRecipeButton.dataset.viewRecipe);
    return;
  }

  const haveButton = event.target.closest("[data-toggle-have]");
  if (haveButton) {
    toggleHave(haveButton.dataset.toggleHave);
  }
});

document.addEventListener("dragstart", (event) => {
  const draggable = event.target.closest("[data-drag-recipe]");
  if (!draggable) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", JSON.stringify({
    recipeId: draggable.dataset.dragRecipe,
    fromDay: draggable.dataset.dragDay ?? "",
    fromUnscheduled: draggable.dataset.dragUnscheduled ?? ""
  }));
});

document.addEventListener("dragover", (event) => {
  const dropTarget = event.target.closest("[data-day-drop], [data-unscheduled-drop]");
  if (!dropTarget) return;
  event.preventDefault();
  dropTarget.classList.add("drag-over");
});

document.addEventListener("dragleave", (event) => {
  const dropTarget = event.target.closest("[data-day-drop], [data-unscheduled-drop]");
  if (dropTarget) dropTarget.classList.remove("drag-over");
});

document.addEventListener("drop", (event) => {
  const dayTarget = event.target.closest("[data-day-drop]");
  const trayTarget = event.target.closest("[data-unscheduled-drop]");
  if (!dayTarget && !trayTarget) return;
  event.preventDefault();
  document.querySelectorAll(".drag-over").forEach((item) => item.classList.remove("drag-over"));
  const payload = dragPayload(event);
  if (!payload?.recipeId) return;
  if (dayTarget) {
    moveRecipeToDay(payload, Number(dayTarget.dataset.dayDrop));
  } else {
    moveRecipeToUnscheduled(payload);
  }
});

function setView(viewName) {
  if (!['recipes', 'recipe-detail'].includes(viewName)) recipePickDayIndex = null;
  document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("active", view.dataset.view === viewName));
  document.querySelectorAll("[data-view-button]").forEach((button) => button.classList.toggle("active", button.dataset.viewButton === viewName));
}

function navigateToView(viewName, options = {}) {
  activeRecipeId = "";
  recipeCanGoBack = false;
  document.body.classList.remove("recipe-detail-open");
  setView(viewName);
  if (!options.fromHistory) {
    history.pushState({ view: viewName }, "", `#${viewName}`);
  }
  if (!options.keepScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function openRecipeDetail(recipeId, options = {}) {
  const recipe = recipeById.get(recipeId);
  if (!recipe) {
    navigateToView("recipes", { fromHistory: options.fromHistory });
    return;
  }

  const currentView = document.querySelector("[data-view].active")?.dataset.view;
  if (options.initial) {
    recipeReturnView = "recipes";
    recipeReturnScroll = 0;
    recipeReturnFocus = null;
  } else if (!activeRecipeId && currentView && currentView !== "recipe-detail") {
    recipeReturnView = currentView;
    recipeReturnScroll = window.scrollY;
    recipeReturnFocus = document.activeElement;
  }

  activeRecipeId = recipeId;
  recipeCanGoBack = Boolean(options.pushHistory || (options.fromHistory && !options.initial));
  renderRecipeDetail(recipe);
  setView("recipe-detail");
  document.body.classList.add("recipe-detail-open");

  if (options.pushHistory) {
    history.pushState({ view: "recipe-detail", recipeId, returnView: recipeReturnView }, "", `#recipe/${encodeURIComponent(recipeId)}`);
  } else if (options.initial) {
    history.replaceState({ view: "recipe-detail", recipeId, returnView: "recipes" }, "", location.hash);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  requestAnimationFrame(() => document.querySelector("#recipeDetailTitle")?.focus({ preventScroll: true }));
}

function closeRecipeDetail() {
  if (recipeCanGoBack) {
    history.back();
    return;
  }
  navigateToView(recipeReturnView || "recipes");
}

function syncRecipeRoute(options = {}) {
  const recipeMatch = location.hash.match(/^#recipe\/([^/?#]+)/);
  if (recipeMatch) {
    openRecipeDetail(decodeURIComponent(recipeMatch[1]), { fromHistory: true, initial: options.initial });
    return;
  }

  const wasRecipeOpen = Boolean(activeRecipeId);
  const returnView = history.state?.view && history.state.view !== "recipe-detail"
    ? history.state.view
    : (location.hash.replace("#", "") || recipeReturnView || "recipes");
  activeRecipeId = "";
  recipeCanGoBack = false;
  document.body.classList.remove("recipe-detail-open");
  setView(["planner", "recipes", "groceries", "pantry"].includes(returnView) ? returnView : "recipes");
  if (wasRecipeOpen) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: recipeReturnScroll, behavior: "auto" });
      if (recipeReturnFocus instanceof HTMLElement && document.contains(recipeReturnFocus)) {
        recipeReturnFocus.focus({ preventScroll: true });
      }
    });
  }
}

function shiftWeek(delta) {
  const currentIndex = weeks.findIndex((week) => week.key === state.activeWeek);
  const nextIndex = Math.max(0, Math.min(weeks.length - 1, currentIndex + delta));
  state.activeWeek = weeks[nextIndex].key;
  ensurePlan(state.activeWeek);
  saveState();
  renderAll();
}

function renderAll() {
  ensurePlan(state.activeWeek);
  renderWeekTabs();
  renderPlanner();
  renderRecipes();
  renderGroceries();
  renderPantry();
  if (activeRecipeId) renderRecipeDetail(recipeById.get(activeRecipeId));
}

function renderWeekTabs() {
  els.weekTabs.innerHTML = weeks.map((week, index) => `
    <button type="button" class="${week.key === state.activeWeek ? "active" : ""}" data-week-key="${week.key}">
      <span>${weekTabLabel(index)}</span>
      <strong>${formatRange(week.start, week.end)}</strong>
    </button>
  `).join("");
}

function renderPlanner() {
  const week = activeWeek();
  const plan = activePlan();
  const plannedIds = [...plannedRecipeIds(plan)];
  const groceries = generateGroceries(plan, week);
  const averageMinutes = plannedIds.length
    ? Math.round(plannedIds.reduce((sum, recipeId) => sum + (recipeById.get(recipeId)?.minutes || 0), 0) / plannedIds.length)
    : 0;

  els.weekTitle.textContent = `Rowta planning calendar for ${formatRange(week.start, week.end)}`;
  els.weekStats.innerHTML = compactWeekSummary(plannedIds.length, groceries.neededCount, averageMinutes || "-");

  els.unscheduledTray.innerHTML = renderUnscheduledTray(plan);
  els.daySlots.innerHTML = plan.slots.map((slot, index) => renderDaySlot(slot, index, week)).join("");
  els.deliverySummary.textContent = `${groceries.deliveries[0].items.length} Saturday items and ${groceries.deliveries[1].items.length} Wednesday items, with pantry staples separated as already on hand.`;
  els.deliveryPreview.innerHTML = groceries.deliveries.map((delivery) => `
    <article>
      <strong>${delivery.title}</strong>
      <span>${formatLongDate(delivery.date)}</span>
      <p>${delivery.items.length} items - covers ${delivery.covers}</p>
    </article>
  `).join("");
}

function renderDaySlot(slot, index, week) {
  const recipe = recipeById.get(slot.recipeId);
  const date = addDays(week.start, index);
  return `
    <article class="day-card ${recipe ? "has-meal" : "empty"}">
      <div class="day-card-date">
        <div>
          <p>${shortDayName(slot.day)}</p>
          <strong>${formatShortDate(date)}</strong>
        </div>
      </div>
      <div class="day-content" data-day-drop="${index}">
        ${recipe ? renderSlotRecipe(recipe, index) : renderAddRecipePrompt(slot, index)}
      </div>
    </article>
  `;
}

function renderSlotRecipe(recipe, index) {
  return `
    <div class="slot-recipe" draggable="true" data-drag-recipe="${escapeAttr(recipe.id)}" data-drag-day="${index}">
      <span class="drag-handle" aria-hidden="true"></span>
      <button type="button" class="recipe-thumb-button" data-view-recipe="${escapeAttr(recipe.id)}" aria-label="View ${escapeAttr(recipe.title)} recipe">
        ${recipe.image ? `<img src="${escapeAttr(recipe.image)}" alt="">` : `<span class="recipe-thumb">${initials(recipe.title)}</span>`}
      </button>
      <div>
        <h3><button type="button" class="recipe-title-button" data-view-recipe="${escapeAttr(recipe.id)}">${escapeHtml(recipe.title)}</button></h3>
        <div class="slot-recipe-footer">
          <div class="meal-meta" aria-label="Meal details">
            <span>${recipe.totalMinutes} min</span>
            <span>${escapeHtml(recipe.primaryProtein || "Flex")}</span>
            <span>${escapeHtml(recipe.normalizedBase || compactBaseLabel(recipe.base))}</span>
          </div>
          ${mealMenu(recipe, index)}
        </div>
      </div>
    </div>
  `;
}

function renderAddRecipePrompt(slot, index) {
  return `
    <button type="button" class="add-recipe-tile" data-open-recipe-picker="${index}" aria-label="Add dinner for ${slot.day}">
      <span class="add-icon" aria-hidden="true">+</span>
      <span class="add-copy">
        <strong>Add dinner</strong>
        <em>Drop recipe here</em>
      </span>
    </button>
  `;
}

function renderUnscheduledTray(plan) {
  const items = (plan.unscheduled || []).map((recipeId) => recipeById.get(recipeId)).filter(Boolean);
  if (!items.length) return "";
  return `
    <section class="unscheduled-panel" data-unscheduled-drop="true" aria-label="Unscheduled meals">
      <div>
        <p class="eyebrow">Unscheduled meals</p>
        <strong>Drag onto a day</strong>
      </div>
      <div class="unscheduled-list">
        ${items.map((recipe) => `
          <article class="unscheduled-meal" draggable="true" data-drag-recipe="${escapeAttr(recipe.id)}" data-drag-unscheduled="true">
            <span class="drag-handle" aria-hidden="true"></span>
            <button type="button" class="recipe-thumb-button" data-view-recipe="${escapeAttr(recipe.id)}" aria-label="View ${escapeAttr(recipe.title)} recipe">
              ${recipe.image ? `<img src="${escapeAttr(recipe.image)}" alt="">` : `<span class="recipe-thumb">${initials(recipe.title)}</span>`}
            </button>
            <div>
              <strong><button type="button" class="recipe-title-button" data-view-recipe="${escapeAttr(recipe.id)}">${escapeHtml(recipe.title)}</button></strong>
              <span>${recipe.totalMinutes} min - ${escapeHtml(recipe.primaryProtein || "Flex")}</span>
            </div>
            <button type="button" data-remove-unscheduled="${escapeAttr(recipe.id)}" aria-label="Remove ${escapeAttr(recipe.title)}">⋯</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function mealMenu(recipe, index) {
  return `
    <details class="meal-menu">
      <summary aria-label="Meal actions">⋯</summary>
      <div>
        <button type="button" data-open-recipe-picker="${index}">Change recipe</button>
        <button type="button" data-remove-day="${index}">Remove from week</button>
        <button type="button" data-view-recipe="${escapeAttr(recipe.id)}">View recipe</button>
      </div>
    </details>
  `;
}

function renderRecipes() {
  const plan = activePlan();
  const selectedIds = plannedRecipeIds(plan);
  const pickingDay = recipePickDayIndex !== null ? plan.slots[recipePickDayIndex] : null;
  const recommended = recommendedRecipes(plan).slice(0, 6);
  const recommendationReasons = recommendationReasonsForShelf(recommended, plan);
  const recipes = sortRecipes(recipeLibrary.filter((recipe) => recipeMatches(recipe, selectedIds)), plan);
  const visibleRecipes = recipes.slice(0, recipeVisibleCount);

  els.recommendedGrid.innerHTML = recommended.map((recipe) => renderRecipeCard(recipe, selectedIds, pickingDay, recommendationReasons.get(recipe.id), "recommended")).join("")
    || `<p class="empty-state">Add a few recipes to the library to unlock recommendations.</p>`;
  if (els.recipeResultCount) els.recipeResultCount.textContent = `${recipes.length} recipe${recipes.length === 1 ? "" : "s"}`;
  els.recipeGrid.classList.toggle("list-view", recipeViewMode === "list");
  document.querySelectorAll("[data-recipe-view]").forEach((button) => button.classList.toggle("active", button.dataset.recipeView === recipeViewMode));
  const recipeResultsMarkup = recipeViewMode === "list"
    ? renderRecipeList(visibleRecipes, selectedIds, pickingDay)
    : visibleRecipes.map((recipe) => renderRecipeCard(recipe, selectedIds, pickingDay, catalogStatusBadge(recipe, selectedIds), "catalog")).join("");
  els.recipeGrid.innerHTML = recipeResultsMarkup || `<p class="empty-state">No recipes match those filters.</p>`;
  els.loadMoreRecipes.hidden = visibleRecipes.length >= recipes.length;
}

function recipeActionLabel(recipe, selected, pickingDay) {
  if (pickingDay) return { text: "Choose", aria: `Choose ${recipe.title} for ${pickingDay.day}` };
  if (selected) return { text: "Added", aria: `Remove ${recipe.title} from this week` };
  return { text: "+ Add", aria: `Add ${recipe.title} to this week` };
}

function renderRecipeCard(recipe, selectedIds, pickingDay, reason = "", context = "catalog") {
  const selected = selectedIds.has(recipe.id);
  const actionLabel = recipeActionLabel(recipe, selected, pickingDay);
  return `
    <article class="recipe-card ${selected ? "selected" : ""} ${context === "recommended" ? "recommendation-card" : ""}">
      <button type="button" class="recipe-card-media" data-view-recipe="${escapeAttr(recipe.id)}" aria-label="View ${escapeAttr(recipe.title)} recipe">
        ${recipe.image ? `<img src="${escapeAttr(recipe.image)}" alt="">` : recipePlaceholder(recipe)}
      </button>
      <div class="recipe-card-body">
        ${reason ? `<p class="recommendation-reason">${escapeHtml(reason)}</p>` : ""}
        <div class="recipe-card-title">
          <div>
            <h3><button type="button" class="recipe-title-button" data-view-recipe="${escapeAttr(recipe.id)}">${escapeHtml(recipe.title)}</button></h3>
            <p class="recipe-meta-line">${recipe.totalMinutes} min - ${escapeHtml(recipe.primaryProtein || "Flex")} - ${escapeHtml(recipe.format || compactBaseLabel(recipe.base))}</p>
          </div>
          <button type="button" class="recipe-action" data-add-recipe="${escapeAttr(recipe.id)}" aria-label="${escapeAttr(actionLabel.aria)}">${actionLabel.text}</button>
        </div>
      </div>
    </article>
  `;
}

function recipePlaceholder(recipe) {
  return `
    <div class="recipe-card-placeholder">
      <span>${initials(recipe.title)}</span>
      <small>${escapeHtml(compactBaseLabel(recipe.base))}</small>
    </div>
  `;
}

function recipeRating(recipe) {
  return state.recipeRatings?.[recipe.id] || recipe.familyRating || 0;
}

function ratingControl(recipe) {
  const rating = recipeRating(recipe);
  return `
    <div class="rating-control" aria-label="Rate ${escapeAttr(recipe.title)}">
      ${[1, 2, 3, 4, 5].map((value) => `
        <button type="button" class="${value <= rating ? "active" : ""}" data-rate-recipe="${escapeAttr(recipe.id)}" data-rating="${value}" aria-label="${value} star${value === 1 ? "" : "s"} for ${escapeAttr(recipe.title)}">★</button>
      `).join("")}
    </div>
  `;
}

function renderRecipeList(recipes, selectedIds, pickingDay) {
  if (!recipes.length) return "";
  return `
    <div class="recipe-list-table" role="table" aria-label="Recipe results">
      <div class="recipe-list-head" role="row">
        <span></span>
        <span>Recipe</span>
        <span>Time</span>
        <span>Protein</span>
        <span>Format</span>
        <span>Rating</span>
        <span>Last cooked</span>
        <span>Action</span>
      </div>
      ${recipes.map((recipe) => {
        const selected = selectedIds.has(recipe.id);
        const actionLabel = recipeActionLabel(recipe, selected, pickingDay);
        return `
          <article class="recipe-list-row ${selected ? "selected" : ""}" role="row">
            <button type="button" class="recipe-list-thumb-button" data-view-recipe="${escapeAttr(recipe.id)}" aria-label="View ${escapeAttr(recipe.title)} recipe">
              ${recipe.image ? `<img class="recipe-list-thumb" src="${escapeAttr(recipe.image)}" alt="">` : `<span class="recipe-list-thumb recipe-thumb">${initials(recipe.title)}</span>`}
            </button>
            <strong><button type="button" class="recipe-title-button" data-view-recipe="${escapeAttr(recipe.id)}">${escapeHtml(recipe.title)}</button></strong>
            <span>${recipe.totalMinutes} min</span>
            <span>${escapeHtml(recipe.primaryProtein)}</span>
            <span>${escapeHtml(recipe.format)}</span>
            ${ratingControl(recipe)}
            <span>${escapeHtml(lastCookedLabel(recipe))}</span>
            <button type="button" class="recipe-action" data-add-recipe="${escapeAttr(recipe.id)}" aria-label="${escapeAttr(actionLabel.aria)}">${actionLabel.text}</button>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderRecipeDetail(recipe) {
  if (!els.recipeDetail || !recipe) return;
  const plan = activePlan();
  const selectedIds = plannedRecipeIds(plan);
  const selected = selectedIds.has(recipe.id);
  const pickingDay = recipePickDayIndex !== null ? plan.slots[recipePickDayIndex] : null;
  const actionLabel = recipeActionLabel(recipe, selected, pickingDay);
  const stages = buildRecipeStages(recipe);
  const equipment = aggregateRecipeEquipment(stages);
  const placement = recipePlacementLabel(recipe.id, plan);
  const ingredients = recipe.ingredientDetails || [];
  const returnLabel = recipeReturnView === "planner" ? "Back to week" : "Back to recipes";
  const ingredientGroups = groupRecipeIngredients(ingredients, stages, recipe);

  els.recipeDetail.innerHTML = `
    <article class="recipe-detail-article">
      <div class="recipe-detail-back-row">
        <button type="button" class="recipe-back-button" data-close-recipe>
          <span aria-hidden="true">←</span> ${returnLabel}
        </button>
        ${placement ? `<span class="recipe-planned-status">${escapeHtml(placement)}</span>` : ""}
      </div>

      <header class="recipe-detail-hero">
        <div class="recipe-detail-image-wrap">
          ${recipe.image
            ? `<img src="${escapeAttr(recipe.image)}" alt="${escapeAttr(recipe.imageAlt || recipe.title)}">`
            : `<div class="recipe-detail-placeholder" role="img" aria-label="No photo available for ${escapeAttr(recipe.title)}">
                <span>${initials(recipe.title)}</span>
                <small>${escapeHtml(recipe.format || compactBaseLabel(recipe.base))}</small>
              </div>`}
        </div>
        <div class="recipe-detail-intro">
          <h1 id="recipeDetailTitle" tabindex="-1">${escapeHtml(recipe.title)}</h1>
          <p class="recipe-detail-overview">${escapeHtml(recipe.overview || recipe.description)}</p>
          <dl class="recipe-detail-meta" aria-label="Recipe details">
            <div><dt>Total</dt><dd>${recipe.totalMinutes} min</dd></div>
            <div><dt>Active</dt><dd>${recipe.activeMinutes} min</dd></div>
            <div><dt>Serves</dt><dd>${recipe.servings}</dd></div>
            <div><dt>Effort</dt><dd>${escapeHtml(titleCase(recipe.difficulty))}</dd></div>
          </dl>
          <div class="recipe-detail-actions">
            <button type="button" class="primary-action recipe-detail-primary" data-add-recipe="${escapeAttr(recipe.id)}" aria-label="${escapeAttr(actionLabel.aria)}">${escapeHtml(actionLabel.text)}</button>
            <button type="button" class="recipe-print-button" data-print-recipe>Print recipe</button>
          </div>
        </div>
      </header>

      <section class="recipe-ingredient-overview" aria-labelledby="recipeIngredientsHeading">
        ${renderCompleteIngredients(recipe, ingredientGroups, equipment, {
          mode: "overview",
          headingId: "recipeIngredientsHeading",
          showHeader: true
        })}
      </section>

      ${recipe.kidFlex ? `
        <aside class="recipe-family-flexibility">
          <p class="eyebrow">Family flexibility</p>
          <p>${escapeHtml(recipe.kidFlex)}</p>
        </aside>
      ` : ""}

      <section class="recipe-method" aria-label="Cooking method">
        ${stages.map((stage, stageIndex) => renderRecipeStage(stage, stageIndex, stages.length, recipe)).join("")}
      </section>
    </article>
  `;
}

function renderCompleteIngredients(recipe, ingredientGroups, equipment, options = {}) {
  const headingId = options.headingId || "recipeIngredientsHeading";
  const mainGroups = ingredientGroups.map((group) => ({
    ...group,
    items: group.items.filter((detail) => !isRecipePantryStaple(detail))
  })).filter((group) => group.items.length);
  const pantryStaples = ingredientGroups.flatMap((group) => group.items).filter(isRecipePantryStaple);
  const previewItems = mainGroups.flatMap((group) => group.items).slice(0, 4);
  const ingredientCount = mainGroups.reduce((total, group) => total + group.items.length, 0) + pantryStaples.length;
  const remainingCount = Math.max(0, ingredientCount - previewItems.length);
  const detailsId = "recipeIngredientDetails";
  const renderGroup = (group) => `
    <section class="recipe-ingredient-group ${mainGroups.length === 1 ? "is-single-group" : ""}">
      <h3>${escapeHtml(group.name)}</h3>
      <ul class="recipe-ingredient-list">
        ${group.items.map((detail) => `
          <li class="${detail.optional ? "optional" : ""}" data-recipe-ingredient-id="${escapeAttr(detail.id)}">
            <span>${escapeHtml(displayIngredientInGroup(detail, group.name))}</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
  const balancedColumns = balanceIngredientGroups(mainGroups);

  return `
    <div class="recipe-complete-ingredients mode-overview" data-ingredient-count="${ingredientCount}">
      <div class="recipe-section-title-row">
        <div>
          <h2 id="${escapeAttr(headingId)}">Ingredients</h2>
          <span>Serves ${recipe.servings}</span>
        </div>
      </div>
      <div class="recipe-ingredient-preview" data-ingredient-preview>
        <p>At a glance</p>
        <ul>
          ${previewItems.map((detail) => `<li>${escapeHtml(detail.original || ingredientDisplay(detail))}</li>`).join("")}
        </ul>
      </div>
      <div id="${detailsId}" class="recipe-ingredient-details" data-ingredient-details hidden>
        ${mainGroups.length > 1 ? `
          <div class="recipe-ingredient-columns" aria-label="Ingredient groups">
            ${balancedColumns.map((column) => `
              <div class="recipe-ingredient-column">
                ${column.map(renderGroup).join("")}
              </div>
            `).join("")}
          </div>
        ` : ""}
        <div class="recipe-ingredient-groups ${mainGroups.length > 1 ? "recipe-ingredient-groups-linear" : ""}">
          ${mainGroups.map(renderGroup).join("")}
        </div>
        ${pantryStaples.length ? `
          <section class="recipe-pantry-staples">
            <h3>Pantry staples</h3>
            <ul>
              ${pantryStaples.map((detail) => `<li data-recipe-ingredient-id="${escapeAttr(detail.id)}">${escapeHtml(detail.original || ingredientDisplay(detail))}</li>`).join("")}
            </ul>
          </section>
        ` : ""}
        ${equipment.length ? renderRecipeEquipment(equipment) : ""}
      </div>
      <button type="button" class="recipe-ingredient-toggle" data-toggle-recipe-ingredients aria-expanded="false" aria-controls="${detailsId}" data-ingredient-remaining="${remainingCount}">
        <span data-ingredient-toggle-label>Show ${remainingCount} more</span>
        <span class="recipe-ingredient-toggle-icon" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function toggleRecipeIngredientOverview(toggle) {
  const overview = toggle.closest(".recipe-complete-ingredients");
  const details = overview?.querySelector("[data-ingredient-details]");
  const preview = overview?.querySelector("[data-ingredient-preview]");
  const primaryToggle = overview?.querySelector(".recipe-ingredient-toggle");
  if (!details || !preview || !primaryToggle) return;
  const willExpand = details.hidden;
  details.hidden = !willExpand;
  preview.hidden = willExpand;
  overview.classList.toggle("ingredients-expanded", willExpand);
  primaryToggle.setAttribute("aria-expanded", String(willExpand));
  const label = primaryToggle.querySelector("[data-ingredient-toggle-label]");
  const remaining = primaryToggle.dataset.ingredientRemaining || "";
  if (label) label.textContent = willExpand ? "Show less" : `Show ${remaining} more`;
}

function isRecipePantryStaple(detail) {
  return Boolean(typeof detail === "object" && detail?.pantryStaple);
}

function balanceIngredientGroups(ingredientGroups) {
  if (ingredientGroups.length < 2) return [ingredientGroups, []];
  const columns = [[], []];
  const weights = [0, 0];
  ingredientGroups
    .map((group, index) => ({ group, index, weight: group.items.length + 1 }))
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
    .forEach((entry) => {
      const columnIndex = weights[0] <= weights[1] ? 0 : 1;
      columns[columnIndex].push(entry);
      weights[columnIndex] += entry.weight;
    });
  return columns
    .sort((a, b) => Math.min(...a.map((entry) => entry.index)) - Math.min(...b.map((entry) => entry.index)))
    .map((column) => column
      .sort((a, b) => a.index - b.index)
      .map((entry) => entry.group));
}

function renderRecipeEquipment(equipment) {
  return `
    <section class="recipe-equipment-list">
      <h3>Equipment</h3>
      <ul>${equipment.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function buildRecipeStages(recipe) {
  return (recipe.stages || []).map((stage, index) => ({
    ...stage,
    id: stage.id || `${recipe.id}-stage-${index + 1}`,
    title: stage.title || `Stage ${index + 1}`,
    actions: stage.actions || []
  }));
}

function renderRecipeStage(stage, stageIndex, stageCount, recipe) {
  const ingredientById = new Map((recipe?.ingredientDetails || []).map((detail) => [detail.id, detail]));
  const ingredientUses = (Array.isArray(stage.ingredientUses) ? stage.ingredientUses : [])
    .filter((use) => {
      if (!use.ingredientId) return true;
      const ingredient = ingredientById.get(use.ingredientId);
      return !isRecipePantryStaple(ingredient) || use.showIfPantry === true;
    });
  const actions = Array.isArray(stage.actions) ? stage.actions : [];
  const actionsMarkup = actions.map(renderRecipeAction).join("");

  return `
    <section class="recipe-stage" id="${escapeAttr(stage.id)}" data-recipe-stage="${escapeAttr(stage.id)}" data-stage-index="${stageIndex}" aria-labelledby="${escapeAttr(stage.id)}-heading">
      <header class="recipe-stage-heading">
        <span class="recipe-stage-number" aria-hidden="true">${String(stageIndex + 1).padStart(2, "0")}</span>
        <div>
          <p class="recipe-stage-kicker">${escapeHtml(stageProgressLabel(stage, stageIndex, stageCount))}</p>
          <h3 id="${escapeAttr(stage.id)}-heading">${escapeHtml(stage.title)}</h3>
        </div>
      </header>

      ${ingredientUses.length ? `
        <div class="recipe-stage-support">
          <div class="recipe-stage-ingredients">
            <h4>You’ll need</h4>
            <ul>
              ${ingredientUses.map((use) => `
                <li class="${use.optional ? "optional" : ""}">
                  <span>${escapeHtml(use.display || use.ingredientId || "")}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      ` : ""}

      <ol class="recipe-step-list">
        ${actionsMarkup}
      </ol>
      ${stage.safetyNote ? renderStageNote("Safety", stage.safetyNote, "safety") : ""}
    </section>
  `;
}

function renderRecipeAction(action) {
  return `
    <li id="${escapeAttr(action.id)}" class="recipe-action-row">
      ${action.title ? `<h4>${escapeHtml(action.title)}</h4>` : ""}
      <p>${escapeHtml(action.instruction || action.text || "")}</p>
    </li>
  `;
}

function renderStageNote(label, text, tone) {
  return `
    <aside class="recipe-stage-note tone-${escapeAttr(tone)}">
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(text)}</p>
    </aside>
  `;
}

function groupRecipeIngredients(ingredients, stages = [], recipe = null) {
  const groups = new Map();
  ingredients.forEach((ingredient, ingredientIndex) => {
    const name = ingredient.component || "Ingredients";
    if (!groups.has(name)) groups.set(name, { name, items: [], ingredientIndex });
    groups.get(name).items.push(ingredient);
  });

  const componentOrder = new Map();
  const authoredComponents = recipe?.ingredientComponentOrder
    || Object.values(recipe?.ingredientComponents || {});
  authoredComponents.forEach((component) => {
    if (!componentOrder.has(component)) componentOrder.set(component, componentOrder.size);
  });

  if (componentOrder.size) {
    return [...groups.values()].sort((a, b) =>
      (componentOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER)
      - (componentOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER)
      || a.ingredientIndex - b.ingredientIndex
    );
  }

  const firstUse = new Map();
  stages.forEach((stage, stageIndex) => {
    (stage.ingredientUses || []).forEach((use) => {
      if (!firstUse.has(use.ingredientId)) firstUse.set(use.ingredientId, stageIndex);
    });
  });

  return [...groups.values()].sort((a, b) => {
    const aStage = Math.min(...a.items.map((item) => firstUse.get(item.id) ?? Number.MAX_SAFE_INTEGER));
    const bStage = Math.min(...b.items.map((item) => firstUse.get(item.id) ?? Number.MAX_SAFE_INTEGER));
    return aStage - bStage || a.ingredientIndex - b.ingredientIndex;
  });
}

function displayIngredientInGroup(ingredient, groupName) {
  const display = ingredient.original || ingredientDisplay(ingredient);
  if (!normalKey(groupName).startsWith("optional")) return display;
  return display
    .replace(/,?\s+optional(?:\s+for\s+adults)?$/i, "")
    .replace(/\s+for\s+adults,?$/i, "");
}

function aggregateRecipeEquipment(stages) {
  const commonTools = new Set([
    "wooden spoon",
    "whisk",
    "plate",
    "shallow bowl",
    "small mixing bowl",
    "mixing bowl",
    "two mixing bowls",
    "salad bowl",
    "small saucepan",
    "tongs"
  ]);
  const seen = new Set();
  return stages.flatMap((stage) => stage.equipment || []).filter((item) => {
    const key = normalKey(item);
    if (!key || commonTools.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stageProgressLabel(stage, index, total) {
  const progress = total === 1 ? "Instructions" : `Stage ${index + 1} of ${total}`;
  return stage?.durationMinutes ? `${progress} · About ${stage.durationMinutes} min` : progress;
}

function recipePlacementLabel(recipeId, plan) {
  const day = plan.slots.find((slot) => slot.recipeId === recipeId)?.day;
  if (day) return `Planned for ${day}`;
  if ((plan.unscheduled || []).includes(recipeId)) return "Added to this week";
  return "";
}

function ingredientDisplay(detail) {
  const amount = detail.quantity === null || detail.quantity === undefined
    ? ""
    : (typeof detail.quantity === "number" ? formatNumber(detail.quantity) : String(detail.quantity));
  return [amount, detail.unit, detail.genericIngredient].filter(Boolean).join(" ");
}

function lastCookedLabel(recipe) {
  if (!recipe.lastCookedAt) return "Never";
  const weeksAgo = weeksSinceLastCooked(recipe);
  return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
}

function lastCookedSortValue(recipe) {
  if (!recipe.lastCookedAt) return 0;
  return new Date(recipe.lastCookedAt).getTime();
}

function weeksSinceLastCooked(recipe) {
  if (!recipe.lastCookedAt) return Infinity;
  return Math.max(1, Math.round((Date.now() - new Date(recipe.lastCookedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)));
}

function catalogStatusBadge(recipe, selectedIds) {
  if (selectedIds.has(recipe.id)) return "Already added";
  if (recipe.recommendationSignals?.familyFavorite) return "Family favorite";
  if (recipe.recommendationSignals?.notCookedRecently) return "Not cooked recently";
  return "";
}

function renderGroceries() {
  const week = activeWeek();
  const groceries = generateGroceries(activePlan(), week);
  els.groceryHeading.textContent = "Shopping list";
  els.groceryDeliveries.innerHTML = groceries.deliveries.map(renderDelivery).join("");
}

function renderDelivery(delivery) {
  const filtered = sectionFilter === "all" ? delivery.items : delivery.items.filter((item) => item.section === sectionFilter);
  const grouped = groupBySection(filtered);
  const total = filtered.reduce((sum, item) => sum + (item.status === "have" ? 0 : item.estimatedCost), 0);

  return `
    <section class="delivery-card ${escapeAttr(delivery.id)}" style="--delivery-accent: ${deliveryAccent(delivery.id)}">
      <header>
        <div>
          <p class="eyebrow">${delivery.covers}</p>
          <h3>${delivery.title}</h3>
          <span>${formatLongDate(delivery.date)}</span>
        </div>
        <strong>$${total.toFixed(2)}</strong>
      </header>
      ${filtered.length ? sectionOrder.map((section) => renderGrocerySection(section, grouped.get(section) || [])).join("") : `<p class="empty-state">No grocery items for this filter.</p>`}
    </section>
  `;
}

function renderGrocerySection(section, items) {
  if (!items.length) return "";
  return `
    <div class="grocery-section" style="${sectionAccentStyle(section)}">
      <h4>${sectionLabel(section)} <span>${items.length}</span></h4>
      ${items.map((item) => `
        <article class="grocery-row ${item.status === "have" ? "have" : ""}">
          <div>
            <strong>${escapeHtml(item.recommendedProductName)}</strong>
            <p>${escapeHtml(item.quantityText)} - ${escapeHtml(item.genericIngredient)}</p>
            <span>${escapeHtml(item.recipes.join(", "))}</span>
          </div>
          <button type="button" data-toggle-have="${escapeAttr(item.key)}">${item.status === "have" ? "Have" : "Need"}</button>
          <em>${item.status === "have" ? "Pantry" : `$${item.estimatedCost.toFixed(2)}`}</em>
        </article>
      `).join("")}
    </div>
  `;
}

function renderPantry() {
  els.pantryTags.innerHTML = recipePantryStaples.map(tag).join("");
  els.ingredientCatalog.innerHTML = renderIngredientCatalog();
}

function renderIngredientCatalog() {
  const rows = ingredientCatalogRows();
  return `
    <table class="catalog-table">
      <thead>
        <tr>
          <th>Ingredient</th>
          <th>Section</th>
          <th>Recipes</th>
          <th>Typical need</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td><strong>${escapeHtml(row.name)}</strong></td>
            <td>${escapeHtml(sectionLabel(row.section))}</td>
            <td>${row.recipes.length}</td>
            <td>${escapeHtml(row.quantity || "varies")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function recipeMatches(recipe, selectedIds = plannedRecipeIds(activePlan())) {
  const text = searchableText(recipe);
  const searchMatch = !recipeSearchText || text.includes(recipeSearchText);
  const facets = recipeFacetData(recipe);
  const timeMatch = recipeFacets.time === "all"
    || (recipeFacets.time === "15" && recipe.totalMinutes <= 15)
    || (recipeFacets.time === "30" && recipe.totalMinutes <= 30)
    || (recipeFacets.time === "45" && recipe.totalMinutes >= 45);
  const selectedMatch = !recipeFacets.added || selectedIds.has(recipe.id);
  return searchMatch
    && timeMatch
    && facetMatch(recipeFacets.protein, facets.protein)
    && facetMatch(recipeFacets.format, facets.format)
    && facetMatch(recipeFacets.base, facets.base)
    && facetMatch(recipeFacets.cuisine, facets.cuisine)
    && facetMatch(recipeFacets.equipment, facets.equipment)
    && facetMatch(recipeFacets.effort, facets.effort)
    && (!recipeFacets.kidFriendly || facets.kidFriendly)
    && (!recipeFacets.leftovers || facets.leftovers)
    && (!recipeFacets.pantry || facets.pantry)
    && (!recipeFacets.lowCleanup || facets.lowCleanup)
    && (!recipeFacets.recentlyCooked || facets.recentlyCooked)
    && (!recipeFacets.freezerFriendly || facets.freezerFriendly)
    && (!recipeFacets.notRecent || recipe.recommendationSignals?.notCookedRecently)
    && (!recipeFacets.favorite || recipe.recommendationSignals?.familyFavorite)
    && selectedMatch;
}

function sortRecipes(recipes, plan) {
  const scored = recipes.map((recipe) => ({ recipe, score: recommendationScore(recipe, plan) }));
  const sorters = {
    recommended: (a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title),
    recentlyAdded: (a, b) => b.recipe.id.localeCompare(a.recipe.id),
    time: (a, b) => a.recipe.totalMinutes - b.recipe.totalMinutes || a.recipe.title.localeCompare(b.recipe.title),
    favorites: (a, b) => recipeRating(b.recipe) - recipeRating(a.recipe) || b.recipe.timesCooked - a.recipe.timesCooked,
    notRecent: (a, b) => lastCookedSortValue(a.recipe) - lastCookedSortValue(b.recipe),
    title: (a, b) => a.recipe.title.localeCompare(b.recipe.title),
    mostCooked: (a, b) => b.recipe.timesCooked - a.recipe.timesCooked || a.recipe.title.localeCompare(b.recipe.title),
    leftovers: (a, b) => Number(b.recipe.goodLeftovers) - Number(a.recipe.goodLeftovers) || b.score - a.score
  };
  return scored.sort(sorters[recipeSortMode] || sorters.recommended).map((item) => item.recipe);
}

function recommendedRecipes(plan) {
  const selectedIds = plannedRecipeIds(plan);
  return sortRecipes(recipeLibrary.filter((recipe) => !selectedIds.has(recipe.id)), plan);
}

function recommendationScore(recipe, plan) {
  const selected = plan.slots.map((slot) => recipeById.get(slot.recipeId)).filter(Boolean);
  const selectedProteins = new Set(selected.map((item) => item.primaryProtein));
  const selectedBases = new Set(selected.map((item) => item.normalizedBase));
  const signals = recipe.recommendationSignals || {};
  let score = 0;
  if (signals.quickDinner) score += 4;
  if (signals.pantryFit) score += 3;
  if (signals.kidFriendly) score += 2;
  if (signals.goodLeftovers) score += 2;
  if (signals.lowCleanup) score += 2;
  if (signals.notCookedRecently) score += 2;
  if (signals.familyFavorite) score += 4;
  if (!selectedProteins.has(recipe.primaryProtein)) score += 3;
  if (!selectedBases.has(recipe.normalizedBase)) score += 2;
  if (recipe.difficulty === "very easy") score += 1;
  return score;
}

function recommendationReasonsForShelf(recipes, plan) {
  const used = new Set();
  return new Map(recipes.map((recipe) => {
    const reason = recommendationReasonOptions(recipe, plan).find((option) => !used.has(option)) || recommendationReasonOptions(recipe, plan)[0] || "Adds variety";
    used.add(reason);
    return [recipe.id, reason];
  }));
}

function recommendationReasonOptions(recipe, plan) {
  const selected = plan.slots.map((slot) => recipeById.get(slot.recipeId)).filter(Boolean);
  const selectedProteins = new Set(selected.map((item) => item.primaryProtein));
  const selectedBases = new Set(selected.map((item) => item.normalizedBase));
  const signals = recipe.recommendationSignals || {};
  return [
    signals.familyFavorite ? "Family favorite" : "",
    signals.notCookedRecently ? "Not cooked recently" : "",
    !selectedProteins.has(recipe.primaryProtein) ? "Adds variety" : "",
    signals.pantryFit ? "Uses pantry staples" : "",
    signals.goodLeftovers ? "Good leftover lunch" : "",
    signals.lowCleanup ? "Low cleanup" : "",
    recipe.totalMinutes <= 20 ? "Fastest option" : "",
    signals.kidFriendly ? "Kid-friendly" : "",
    !selectedBases.has(recipe.normalizedBase) ? "Balances the week" : "",
    signals.goodForBusyNight ? "Good for busy night" : ""
  ].filter(Boolean);
}

function facetMatch(filterValue, values) {
  if (filterValue === "all") return true;
  return values.includes(filterValue);
}

function recipeFacetData(recipe) {
  return {
    protein: recipe.proteins.map((item) => normalKey(item)),
    format: [normalKey(recipe.format)],
    base: [normalKey(recipe.normalizedBase)],
    cuisine: [normalKey(recipe.cuisine)],
    equipment: recipe.equipment.map(normalKey),
    effort: [normalKey(recipe.difficulty)],
    kidFriendly: recipe.kidFriendly,
    leftovers: recipe.goodLeftovers,
    pantry: recipe.pantryFriendly,
    lowCleanup: recipe.lowCleanup,
    recentlyCooked: weeksSinceLastCooked(recipe) <= 4,
    freezerFriendly: recipe.freezerFriendly
  };
}

function applyRecipeCollection(collection) {
  clearRecipeFilters({ render: false, keepCollection: true });
  activeRecipeCollection = collection;
  const collectionSettings = {
    quick: { time: "30" },
    favorites: { favorite: true },
    notRecent: { notRecent: true },
    pantry: { pantry: true },
    lowCleanup: { lowCleanup: true },
    leftovers: { leftovers: true },
    kidFriendly: { kidFriendly: true },
    recentlyAdded: {}
  };
  Object.assign(recipeFacets, collectionSettings[collection] || {});
  recipeSortMode = collection === "favorites"
    ? "favorites"
    : collection === "notRecent"
      ? "notRecent"
      : collection === "recentlyAdded"
        ? "recentlyAdded"
        : "recommended";
  recipeVisibleCount = 12;
  syncRecipeControls();
  renderRecipes();
}

function clearActiveCollection() {
  activeRecipeCollection = "";
  document.querySelectorAll("[data-recipe-collection]").forEach((button) => button.classList.remove("active"));
}

function clearRecipeFilters(options = {}) {
  const { render = true, keepCollection = false } = options;
  Object.keys(recipeFacets).forEach((key) => {
    recipeFacets[key] = typeof recipeFacets[key] === "boolean" ? false : "all";
  });
  recipeSearchText = "";
  recipeVisibleCount = 12;
  recipeSortMode = "recommended";
  if (!keepCollection) clearActiveCollection();
  syncRecipeControls();
  if (render) renderRecipes();
}

function syncRecipeControls() {
  if (els.recipeSearch) els.recipeSearch.value = recipeSearchText;
  if (els.recipeSort) els.recipeSort.value = recipeSortMode;
  document.querySelectorAll("[data-recipe-facet]").forEach((control) => {
    control.value = recipeFacets[control.dataset.recipeFacet] || "all";
  });
  document.querySelectorAll("[data-recipe-flag]").forEach((control) => {
    control.checked = Boolean(recipeFacets[control.dataset.recipeFlag]);
  });
}

function rateRecipe(recipeId, rating) {
  if (!recipeById.has(recipeId) || rating < 1 || rating > 5) return;
  state.recipeRatings = state.recipeRatings || {};
  state.recipeRatings[recipeId] = rating;
  saveState();
  renderRecipes();
}

function chooseRecipe(recipeId) {
  if (recipePickDayIndex !== null) {
    assignRecipeToDay(recipePickDayIndex, recipeId, { returnToPlanner: true });
    return;
  }

  const plan = activePlan();
  if (plannedRecipeIds(plan).has(recipeId)) {
    removeRecipeFromWeek(recipeId);
  } else {
    addUnscheduledRecipe(recipeId);
  }
  saveState();
  renderAll();
}

function assignRecipeToDay(index, recipeId, options = {}) {
  const plan = activePlan();
  if (recipeId) removeRecipeFromWeek(recipeId);
  plan.slots[index].recipeId = recipeId;
  recipePickDayIndex = null;
  saveState();
  if (options.returnToPlanner) navigateToView("planner");
  renderAll();
}

function removeRecipeFromDay(index) {
  const plan = activePlan();
  plan.slots[index].recipeId = "";
  saveState();
  renderAll();
}

function addUnscheduledRecipe(recipeId) {
  const plan = activePlan();
  plan.unscheduled = plan.unscheduled || [];
  if (!plan.unscheduled.includes(recipeId)) plan.unscheduled.push(recipeId);
}

function removeUnscheduledRecipe(recipeId) {
  const plan = activePlan();
  plan.unscheduled = (plan.unscheduled || []).filter((id) => id !== recipeId);
  saveState();
  renderAll();
}

function removeRecipeFromWeek(recipeId) {
  const plan = activePlan();
  plan.slots.forEach((slot) => {
    if (slot.recipeId === recipeId) slot.recipeId = "";
  });
  plan.unscheduled = (plan.unscheduled || []).filter((id) => id !== recipeId);
}

function plannedRecipeIds(plan) {
  return new Set([
    ...plan.slots.map((slot) => slot.recipeId).filter(Boolean),
    ...(plan.unscheduled || [])
  ]);
}

function viewRecipe(recipeId) {
  openRecipeDetail(recipeId, { pushHistory: true });
}

function dragPayload(event) {
  try {
    return JSON.parse(event.dataTransfer.getData("text/plain"));
  } catch {
    return null;
  }
}

function moveRecipeToDay(payload, targetIndex) {
  const plan = activePlan();
  const fromIndex = payload.fromDay === "" ? -1 : Number(payload.fromDay);
  const targetRecipeId = plan.slots[targetIndex]?.recipeId || "";

  if (fromIndex === targetIndex) return;
  if (fromIndex >= 0) {
    plan.slots[fromIndex].recipeId = targetRecipeId;
  } else {
    plan.unscheduled = (plan.unscheduled || []).filter((id) => id !== payload.recipeId);
    if (targetRecipeId) addUnscheduledRecipe(targetRecipeId);
  }
  plan.slots[targetIndex].recipeId = payload.recipeId;
  saveState();
  renderAll();
}

function moveRecipeToUnscheduled(payload) {
  const plan = activePlan();
  const fromIndex = payload.fromDay === "" ? -1 : Number(payload.fromDay);
  if (fromIndex >= 0) plan.slots[fromIndex].recipeId = "";
  addUnscheduledRecipe(payload.recipeId);
  saveState();
  renderAll();
}

function toggleHave(itemKey) {
  const weekState = state.haveByWeek[state.activeWeek] || {};
  weekState[itemKey] = !weekState[itemKey];
  state.haveByWeek[state.activeWeek] = weekState;
  saveState();
  renderGroceries();
  renderPlanner();
}

function generateGroceries(plan, week) {
  const deliveries = deliveryDefinitions(week).map((delivery) => ({ ...delivery, items: [] }));
  const itemMap = new Map();
  const haveState = state.haveByWeek[state.activeWeek] || {};

  const plannedMeals = [
    ...plan.slots.map((slot, dayIndex) => ({ recipeId: slot.recipeId, dayIndex })),
    ...(plan.unscheduled || []).map((recipeId) => ({ recipeId, dayIndex: 0 }))
  ];

  plannedMeals.forEach(({ recipeId, dayIndex }) => {
    const recipe = recipeById.get(recipeId);
    if (!recipe) return;
    recipe.ingredientDetails.forEach((detail) => {
      const genericIngredient = detail.genericIngredient || detail.original;
      if (!genericIngredient || shouldIgnoreIngredient(genericIngredient)) return;

      const section = normalizedSection(detail.section);
      const delivery = deliveryForIngredient(deliveries, section, dayIndex);
      const key = `${delivery.id}|${normalKey(genericIngredient)}`;
      const product = catalogProductFor(genericIngredient);

      if (!itemMap.has(key)) {
        itemMap.set(key, {
          key,
          deliveryId: delivery.id,
          genericIngredient,
          section,
          unit: detail.unit || "",
          quantity: 0,
          hasNumericQuantity: false,
          mixedQuantity: false,
          recipes: new Set(),
          recommendedProductName: product?.recommendedProductName || genericIngredient,
          estimatedCost: product?.estimatedCost || estimateCost(section),
          status: pantryHas(genericIngredient) ? "have" : "need"
        });
      }

      const item = itemMap.get(key);
      item.recipes.add(recipe.title);
      addQuantity(item, detail);
    });
  });

  itemMap.forEach((item) => {
    item.recipes = [...item.recipes];
    item.quantityText = quantityText(item);
    if (haveState[item.key]) item.status = item.status === "have" ? "need" : "have";
    deliveries.find((delivery) => delivery.id === item.deliveryId).items.push(item);
  });

  deliveries.forEach((delivery) => {
    delivery.items.sort((a, b) => sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section) || a.genericIngredient.localeCompare(b.genericIngredient));
  });

  return {
    deliveries,
    neededCount: deliveries.flatMap((delivery) => delivery.items).filter((item) => item.status !== "have").length
  };
}

function deliveryDefinitions(week) {
  return [
    {
      id: "saturday",
      title: "Saturday delivery",
      date: addDays(week.start, -1),
      covers: "Sunday-Tuesday dinners + staples"
    },
    {
      id: "wednesday",
      title: "Wednesday delivery",
      date: addDays(week.start, 3),
      covers: "Wednesday-Saturday fresh items"
    }
  ];
}

function deliveryForIngredient(deliveries, section, dayIndex) {
  if (shelfStableSections.has(section)) return deliveries[0];
  return dayIndex <= 2 ? deliveries[0] : deliveries[1];
}

function ingredientCatalogRows() {
  const rows = new Map();
  recipeLibrary.forEach((recipe) => {
    recipe.ingredientDetails.forEach((detail) => {
      const name = detail.genericIngredient || detail.original;
      if (!name || shouldIgnoreIngredient(name)) return;
      const key = normalKey(name);
      if (!rows.has(key)) {
        rows.set(key, {
          name,
          section: normalizedSection(detail.section),
          recipes: new Set(),
          quantities: []
        });
      }
      const row = rows.get(key);
      row.recipes.add(recipe.title);
      if (typeof detail.quantity === "number" && detail.unit) row.quantities.push(`${formatNumber(detail.quantity)} ${detail.unit}`);
    });
  });

  return [...rows.values()]
    .map((row) => ({ ...row, recipes: [...row.recipes], quantity: mostCommon(row.quantities) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function activeWeek() {
  return weeks.find((week) => week.key === state.activeWeek) || weeks[0];
}

function activePlan() {
  ensurePlan(state.activeWeek);
  return state.plans[state.activeWeek];
}

function ensurePlan(weekKey) {
  if (state.plans[weekKey]) return;
  const weekIndex = Math.max(0, weeks.findIndex((week) => week.key === weekKey));
  state.plans[weekKey] = createPlan(weekKey, weekIndex);
}

function createPlan(weekKey, weekIndex) {
  const seedIds = weekIndex === state.defaultSeedWeekIndex ? recipeLibrary.slice(0, 6).map((recipe) => recipe.id) : [];
  return {
    weekStart: weekKey,
    slots: dayNames.map((day, index) => ({
      day,
      recipeId: seedIds[index] || ""
    })),
    unscheduled: []
  };
}

function loadState() {
  const defaultWeekIndex = defaultActiveWeekIndex();
  const defaultState = {
    activeWeek: weeks[defaultWeekIndex].key,
    defaultSeedWeekIndex: defaultWeekIndex,
    plans: {},
    haveByWeek: {},
    recipeRatings: {}
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return defaultState;
    const activeWeek = weeks.some((week) => week.key === saved.activeWeek) ? saved.activeWeek : defaultState.activeWeek;
    return {
      ...defaultState,
      ...saved,
      activeWeek,
      defaultSeedWeekIndex: saved.defaultSeedWeekIndex ?? defaultWeekIndex,
      plans: normalizeSavedPlans(saved.plans || {}),
      haveByWeek: saved.haveByWeek || {},
      recipeRatings: saved.recipeRatings || {}
    };
  } catch {
    return defaultState;
  }
}

function normalizeSavedPlans(plans) {
  Object.values(plans).forEach((plan) => {
    const slots = plan.slots || [];
    plan.slots = dayNames.map((day, index) => ({
      day: slots[index]?.day || day,
      recipeId: slots[index]?.recipeId || ""
    }));
    plan.unscheduled = [...new Set((plan.unscheduled || []).filter((recipeId) => recipeById.has(recipeId)))];
  });
  return plans;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function buildWeeks() {
  const start = startOfWeek(new Date());
  return Array.from({ length: 5 }, (_, index) => {
    const weekStart = addDays(start, index * 7);
    return {
      key: isoDate(weekStart),
      start: weekStart,
      end: addDays(weekStart, 6)
    };
  });
}

function defaultActiveWeekIndex() {
  const today = new Date();
  return today.getDay() >= 4 ? 1 : 0;
}

function normalizeRecipeRecord(recipe) {
  const id = recipe.id || slugify(recipe.title);
  const recipeIngredients = recipe.ingredients || [];
  const rawIngredientDetails = (recipe.ingredientDetails?.length
    ? recipe.ingredientDetails
    : recipeIngredients.map((ingredient) => typeof ingredient === "string"
      ? ingredientDetail(ingredient, null, "", "Other")
      : ingredient));
  const ingredientIdCounts = new Map();
  const optionalIngredientIds = new Set(recipe.optionalIngredientIds || []);
  const ingredientDetails = rawIngredientDetails.map((detail) => {
    const baseId = detail.id || slugify(detail.genericIngredient || detail.original || "ingredient");
    const occurrence = (ingredientIdCounts.get(baseId) || 0) + 1;
    ingredientIdCounts.set(baseId, occurrence);
    const id = occurrence === 1 ? baseId : `${baseId}-${occurrence}`;
    const genericIngredient = canonicalIngredient(detail.genericIngredient || detail.original);
    return {
      ...detail,
      id,
      genericIngredient,
      section: normalizedSection(detail.section),
      component: detail.component || recipe.ingredientComponents?.[id] || recipe.ingredientComponents?.[baseId] || "Ingredients",
      optional: detail.optional ?? optionalIngredientIds.has(id) ?? false,
      pantryStaple: recipePantryStapleKeys.has(normalKey(genericIngredient))
    };
  });
  const ingredients = recipeIngredients.length
    ? recipeIngredients.map((ingredient) => canonicalIngredient(typeof ingredient === "string" ? ingredient : ingredient.genericIngredient || ingredient.original))
    : ingredientDetails.map((detail) => detail.genericIngredient);
  const metadata = inferRecipeMetadata({
    ...recipe,
    id,
    revision: recipe.revision || 1,
    ingredients,
    ingredientDetails,
    image: recipe.image || "",
    imageAlt: recipe.imageAlt || recipe.title
  });

  return {
    id,
    title: recipe.title,
    shortTitle: recipe.shortTitle || recipe.title,
    description: recipe.description || recipe.overview || "",
    minutes: recipe.minutes || 30,
    totalMinutes: recipe.totalMinutes || recipe.minutes || 30,
    activeMinutes: recipe.activeMinutes || Math.max(10, Math.round((recipe.minutes || 30) * 0.75)),
    servings: recipe.servings || 4,
    protein: recipe.protein || "Flex",
    primaryProtein: metadata.primaryProtein,
    proteins: metadata.proteins,
    format: metadata.format,
    normalizedBase: metadata.base,
    cuisine: metadata.cuisine,
    difficulty: metadata.difficulty,
    kidFriendly: metadata.kidFriendly,
    goodLeftovers: metadata.goodLeftovers,
    pantryFriendly: metadata.pantryFriendly,
    lowCleanup: metadata.lowCleanup,
    freezerFriendly: metadata.freezerFriendly,
    equipment: metadata.equipment,
    lastCookedAt: metadata.lastCookedAt,
    timesCooked: metadata.timesCooked,
    familyRating: metadata.familyRating,
    repeatCooldownWeeks: metadata.repeatCooldownWeeks,
    recommendationSignals: metadata.recommendationSignals,
    base: recipe.base || "Dinner",
    image: recipe.image || "",
    imageUrl: recipe.image || "",
    imageAlt: recipe.imageAlt || recipe.title,
    overview: recipe.overview || "",
    tags: metadata.tags,
    ingredients: [...new Set(ingredients.filter(Boolean))],
    ingredientDetails,
    ingredientComponentOrder: recipe.ingredientComponentOrder?.length
      ? [...recipe.ingredientComponentOrder]
      : [...new Set(Object.values(recipe.ingredientComponents || {}))],
    reusePotential: recipe.reusePotential || [],
    kidFlex: recipe.kidFlex || "",
    steps: recipe.steps || [],
    stages: recipe.stages || [],
    sourceLinks: recipe.sourceLinks || [],
    needsReview: recipe.needsReview || false,
    notes: recipe.notes || []
  };
}

function inferRecipeMetadata(recipe) {
  const text = searchableText({
    ...recipe,
    overview: recipe.overview || recipe.description || "",
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || []
  });
  const totalMinutes = recipe.totalMinutes || recipe.minutes || 30;
  const primaryProtein = controlledProtein(recipe.protein || "", text);
  const format = controlledFormat(recipe.base || "", text);
  const base = controlledBase(recipe.base || "", text);
  const cuisine = controlledCuisine(text);
  const difficulty = recipe.difficulty || (totalMinutes <= 25 ? "very easy" : totalMinutes >= 45 ? "medium" : "easy");
  const pantryFriendly = recipePantryStaples.filter((item) => text.includes(normalKey(item))).length >= 2
    || ["Rice", "Pasta", "Tortillas", "Potatoes"].includes(base);
  const kidFriendly = Boolean(recipe.kidFlex) || totalMinutes <= 30 || text.includes("kid");
  const goodLeftovers = ["Pasta", "Rice", "Potatoes"].includes(base) || text.includes("leftover") || text.includes("batch");
  const lowCleanup = ["Skillet", "Sheet pan", "One-pan", "Bowl"].includes(format) || text.includes("one-pan");
  const timesCooked = recipe.timesCooked ?? 0;
  const weeksSinceCooked = null;
  const lastCookedAt = recipe.lastCookedAt || "";
  const familyRating = recipe.familyRating ?? 0;
  const familyFavorite = familyRating >= 4 && timesCooked >= 3;
  const notCookedRecently = !lastCookedAt || (weeksSinceCooked || 99) >= 6;
  const tags = controlledTags({
    sourceTags: recipe.tags || [],
    totalMinutes,
    kidFriendly,
    goodLeftovers,
    pantryFriendly,
    lowCleanup,
    familyFavorite,
    notCookedRecently
  });

  return {
    primaryProtein,
    proteins: [...new Set([primaryProtein])],
    format,
    base,
    cuisine,
    difficulty,
    kidFriendly,
    goodLeftovers,
    pantryFriendly,
    lowCleanup,
    freezerFriendly: false,
    equipment: controlledEquipment(format, text),
    lastCookedAt,
    timesCooked,
    familyRating,
    repeatCooldownWeeks: familyFavorite ? 2 : 4,
    tags,
    recommendationSignals: {
      quickDinner: totalMinutes <= 30,
      notCookedRecently,
      familyFavorite,
      addsVariety: true,
      pantryFit: pantryFriendly,
      goodForBusyNight: totalMinutes <= 30 && difficulty !== "medium",
      goodLeftovers,
      kidFriendly,
      lowCleanup
    }
  };
}

function controlledProtein(rawProtein, text) {
  const raw = normalKey(`${rawProtein} ${text}`);
  if (raw.includes("chicken")) return "Chicken";
  if (raw.includes("beef") || raw.includes("steak")) return "Beef";
  if (raw.includes("sausage")) return "Sausage";
  if (raw.includes("pork")) return "Pork";
  if (raw.includes("turkey")) return "Ground turkey";
  if (raw.includes("egg")) return "Eggs";
  if (raw.includes("shrimp") || raw.includes("salmon") || raw.includes("fish")) return "Seafood";
  if (raw.includes("vegetarian") || raw.includes("flex")) return "Vegetarian";
  return "Vegetarian";
}

function controlledFormat(rawBase, text) {
  const raw = normalKey(`${rawBase} ${text}`);
  if (raw.includes("tostada")) return "Tostadas";
  if (raw.includes("taco")) return "Tacos";
  if (raw.includes("sheet pan")) return "Sheet pan";
  if (raw.includes("skillet")) return "Skillet";
  if (raw.includes("bowl")) return "Bowl";
  if (raw.includes("pasta") || raw.includes("orecchiette") || raw.includes("spaghetti")) return "Pasta";
  if (raw.includes("salad")) return "Salad";
  if (raw.includes("sandwich") || raw.includes("burger")) return "Sandwich";
  if (raw.includes("soup")) return "Soup";
  if (raw.includes("casserole")) return "Casserole";
  if (raw.includes("one-pan") || raw.includes("one pan")) return "One-pan";
  return "One-pan";
}

function controlledBase(rawBase, text) {
  const raw = normalKey(`${rawBase} ${text}`);
  if (raw.includes("rice")) return "Rice";
  if (raw.includes("orzo")) return "Orzo";
  if (raw.includes("couscous")) return "Couscous";
  if (raw.includes("noodle")) return "Noodles";
  if (raw.includes("pasta") || raw.includes("orecchiette") || raw.includes("spaghetti")) return "Pasta";
  if (raw.includes("potato") || raw.includes("fries")) return "Potatoes";
  if (raw.includes("tortilla") || raw.includes("taco") || raw.includes("tostada")) return "Tortillas";
  if (raw.includes("green") || raw.includes("salad") || raw.includes("lettuce")) return "Greens";
  if (raw.includes("bread") || raw.includes("bun")) return "Bread";
  return "None";
}

function controlledCuisine(text) {
  if (text.includes("italian") || text.includes("piccata") || text.includes("orecchiette") || text.includes("parmesan")) return "Italian";
  if (text.includes("mexican") || text.includes("taco") || text.includes("tostada")) return "Mexican";
  if (text.includes("mediterranean") || text.includes("feta") || text.includes("greek")) return "Mediterranean";
  if (text.includes("moroccan")) return "Moroccan";
  if (text.includes("asian") || text.includes("fried rice") || text.includes("teriyaki") || text.includes("soy")) return "Asian-inspired";
  if (text.includes("steak") || text.includes("burger") || text.includes("american")) return "American";
  return "General weeknight";
}

function controlledEquipment(format, text) {
  const equipment = new Set();
  if (["Skillet", "One-pan", "Tacos", "Tostadas"].includes(format) || text.includes("skillet")) equipment.add("skillet");
  if (format === "Sheet pan" || text.includes("sheet pan")) equipment.add("sheet pan");
  if (text.includes("air fryer")) equipment.add("air fryer");
  if (format === "Pasta" || text.includes("pot")) equipment.add("pot");
  return [...equipment];
}

function controlledTags({ sourceTags, totalMinutes, kidFriendly, goodLeftovers, pantryFriendly, lowCleanup, familyFavorite, notCookedRecently }) {
  return [...new Set([
    ...sourceTags.map((tag) => slugify(tag)),
    totalMinutes <= 30 ? "quick" : "",
    "weeknight",
    kidFriendly ? "kid-friendly" : "",
    goodLeftovers ? "good-leftovers" : "",
    pantryFriendly ? "pantry-friendly" : "",
    lowCleanup ? "low-cleanup" : "",
    familyFavorite ? "family-favorite" : "",
    notCookedRecently ? "not-cooked-recently" : ""
  ].filter(Boolean))];
}

function stableNumber(seed, min, max) {
  const text = String(seed || "");
  const total = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return min + (total % (max - min + 1));
}

function ingredientDetail(genericIngredient, quantity, unit, section, preferences = []) {
  return {
    original: genericIngredient,
    genericIngredient,
    quantity,
    unit,
    section,
    preferences,
    productSearchTerms: [genericIngredient],
    needsReview: false
  };
}

function canonicalIngredient(value) {
  if (!value) return "";
  const key = normalKey(value);
  const aliases = {
    "microwave rice": "Rice",
    "microwave jasmine rice": "Rice",
    "yellow rice": "Rice",
    "long grain white rice": "Rice",
    "jasmine rice": "Rice"
  };
  return aliases[key] || value;
}

function catalogProductFor(name) {
  return catalogByIngredient.get(normalKey(name));
}

function shouldIgnoreIngredient(name) {
  return ["water", "reserved pasta water", "reserved noodle water"].includes(normalKey(name));
}

function pantryHas(name) {
  return recipePantryStapleKeys.has(normalKey(name));
}

function addQuantity(item, detail) {
  if (typeof detail.quantity !== "number" || !Number.isFinite(detail.quantity)) {
    item.mixedQuantity = true;
    return;
  }
  const unit = detail.unit || "";
  if (!item.hasNumericQuantity) {
    item.unit = unit;
    item.quantity = detail.quantity;
    item.hasNumericQuantity = true;
    return;
  }
  if (item.unit === unit) {
    item.quantity += detail.quantity;
  } else {
    item.mixedQuantity = true;
  }
}

function quantityText(item) {
  if (!item.hasNumericQuantity || item.mixedQuantity) return "quantity varies";
  return `${formatNumber(item.quantity)} ${pluralizeUnit(item.unit, item.quantity)}`.trim();
}

function groupBySection(items) {
  return items.reduce((groups, item) => {
    if (!groups.has(item.section)) groups.set(item.section, []);
    groups.get(item.section).push(item);
    return groups;
  }, new Map());
}

function normalizedSection(section) {
  if (!section) return "Other";
  if (section === "Pantry") return "Dry Goods";
  if (sectionOrder.includes(section)) return section;
  return "Other";
}

function sectionLabel(section) {
  if (section === "Dry Goods") return "Pantry";
  return section;
}

function estimateCost(section) {
  return {
    Protein: 10.99,
    Produce: 3.49,
    Dairy: 4.99,
    Bakery: 4.49,
    "Dry Goods": 4.49,
    Frozen: 5.49,
    Deli: 5.99,
    Baking: 3.99,
    Spices: 3.99
  }[section] || 3.99;
}

function searchableText(recipe) {
  return [
    recipe.title,
    recipe.shortTitle,
    recipe.protein,
    recipe.primaryProtein,
    ...(recipe.proteins || []),
    recipe.format,
    recipe.normalizedBase,
    recipe.cuisine,
    recipe.difficulty,
    ...(recipe.equipment || []),
    recipe.base,
    recipe.overview,
    recipe.description,
    ...(recipe.tags || []),
    ...(recipe.ingredients || [])
  ].join(" ").toLowerCase();
}

function mostCommon(values) {
  if (!values.length) return "";
  const counts = values.reduce((map, value) => map.set(value, (map.get(value) || 0) + 1), new Map());
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function compactWeekSummary(recipeCount, neededCount, averageMinutes) {
  return `
    <span><strong>${escapeHtml(String(recipeCount))}</strong> meals</span>
    <span><strong>${escapeHtml(String(neededCount))}</strong> items to buy</span>
    <span><strong>${escapeHtml(String(averageMinutes))}</strong> min avg</span>
  `;
}

function tag(label) {
  return `<span>${escapeHtml(label)}</span>`;
}

function categoryChips(recipe) {
  return `
    <div class="category-chips">
      ${chip(recipe.protein || "Flex")}
      ${chip(compactBaseLabel(recipe.base))}
      ${chip(`${recipe.minutes || "?"} min`, "blue")}
    </div>
  `;
}

function chip(label, forcedTone) {
  return `<span class="chip tone-${forcedTone || toneForLabel(label)}">${escapeHtml(label)}</span>`;
}

function deliveryAccent(deliveryId) {
  return deliveryId === "wednesday" ? "var(--blue)" : "var(--herb)";
}

function sectionAccentStyle(section) {
  const tone = sectionTone(section);
  return `--section-accent: ${accentForTone(tone)}; --section-bg: ${softAccentForTone(tone)};`;
}

function sectionTone(section) {
  const key = normalKey(section);
  if (key.includes("protein") || key.includes("deli")) return "tomato";
  if (key.includes("produce")) return "sage";
  if (key.includes("dairy") || key.includes("frozen")) return "blue";
  if (key.includes("dry") || key.includes("bakery") || key.includes("baking")) return "lemon";
  return "sage";
}

function compactBaseLabel(base) {
  const text = normalKey(base || "");
  if (text.includes("rice")) return "Rice";
  if (text.includes("pasta") || text.includes("orecchiette") || text.includes("noodle")) return "Pasta";
  if (text.includes("salad")) return "Salad";
  if (text.includes("taco") || text.includes("tortilla")) return "Tacos";
  if (text.includes("fries") || text.includes("potato")) return "Potatoes";
  if (text.includes("sheet pan")) return "Sheet pan";
  if (text.includes("skillet")) return "Skillet";
  return base || "Dinner";
}

function toneForLabel(label) {
  const text = normalKey(label);
  if (text.includes("beef") || text.includes("steak") || text.includes("pork") || text.includes("sausage")) return "tomato";
  if (text.includes("chicken") || text.includes("turkey") || text.includes("vegetable") || text.includes("salad")) return "herb";
  if (text.includes("rice") || text.includes("grain")) return "sage";
  if (text.includes("pasta") || text.includes("potato") || text.includes("fries")) return "lemon";
  if (text.includes("fish") || text.includes("shrimp") || text.includes("seafood")) return "blue";
  return "sage";
}

function accentForTone(tone) {
  const accents = {
    tomato: "var(--tomato)",
    herb: "var(--herb)",
    lemon: "var(--lemon)",
    sage: "var(--sage-ink)",
    blue: "var(--blue)"
  };
  return accents[tone] || "var(--sage-ink)";
}

function softAccentForTone(tone) {
  const accents = {
    tomato: "var(--tomato-soft)",
    herb: "var(--sage)",
    lemon: "var(--lemon-soft)",
    sage: "var(--sage)",
    blue: "var(--blue-soft)"
  };
  return accents[tone] || "var(--sage)";
}

function initials(title) {
  return escapeHtml(title.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase());
}

function weekTabLabel(index) {
  if (index === 0) return "This week";
  if (index === 1) return "Next week";
  return "Upcoming";
}

function shortDayName(day) {
  return String(day || "").slice(0, 3);
}

function startOfWeek(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRange(start, end) {
  const startMonth = start.toLocaleString(undefined, { month: "short" });
  const endMonth = end.toLocaleString(undefined, { month: "short" });
  if (startMonth === endMonth) return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  return `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}`;
}

function formatLongDate(date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatShortDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : Number(value.toFixed(2)).toString();
}

function pluralizeUnit(unit, quantity) {
  if (!unit) return "";
  if (quantity === 1) return unit;
  const plurals = {
    count: "",
    bunch: "bunches",
    box: "boxes"
  };
  return plurals[unit] ?? (unit.endsWith("s") ? unit : `${unit}s`);
}

function normalKey(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return normalKey(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCase(value) {
  return String(value || "").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
