# Site Consistency and Recipe Copy Execution Plan

## Goal

Make Rowta feel natural in a mobile browser, bring the full interface to a consistent and balanced visual standard, and extend the new ingredient-led planner descriptions from six recipes to all 36 recipes with intentional sentence casing.

This document is the execution reference. Work should proceed in the order below so broad shared fixes land before narrow exceptions.

## Confirmed Baseline

- The catalog contains 36 structured recipes.
- Six planner descriptions currently live in `plannerMenuDescriptions` in `app.js`.
- Those six descriptions are lowercase ingredient-led fragments.
- At widths up to 760px, the primary app navigation becomes a fixed floating bottom bar.
- The mobile bar is reinforced by later overlapping CSS that adds a page-bottom fade, extra elevation, and additional bottom clearance.
- The rendered 390 x 844 view confirms that the bar overlays the page and visually competes with mobile-browser chrome.
- Control sizing currently varies by role and viewport. Examples in the rendered mobile recipes view include 22px rating controls, 28px add buttons, 32px utility buttons, 34px view toggles, 40-44px thumbnail/week controls, and 56px floating navigation buttons.
- The current tree is clean before planning work begins.

## Product Decisions

### Mobile browser navigation

Use an in-flow, page-level navigation treatment on mobile.

- Keep Week, Recipes, and Groceries as the primary destinations.
- Place the navigation naturally in the week/context area near the top of the page.
- Let it scroll with the document rather than float above content.
- Remove the bottom fade, floating-bar shadow treatment, safe-area positioning, and artificial page-bottom clearance that exist only for the dock.
- Preserve a minimum 44px touch target and a clear active state.
- Keep recipe-detail behavior focused: no redundant app navigation should crowd the recipe title or cooking method.

### Visual consistency

Fix shared component rules before applying local exceptions.

- Icons must be centered geometrically and optically within their controls.
- Controls with the same role must share height, padding, radius, icon size, and label alignment.
- Touch targets must remain usable even when the visible control is visually compact.
- Cards, section bands, toolbars, pills, counters, and empty states should use a small shared spacing and radius vocabulary.
- Content-driven height is acceptable for titles and prose; arbitrary height differences between equivalent controls are not.
- Long recipe names and narrow layouts must wrap without shifting adjacent controls out of alignment.

### Recipe planner descriptions

Treat the description as recipe content, not renderer-specific copy.

- Add one authored planner/menu description for every recipe in `data/recipes.js`.
- Remove the six-entry display override map from `app.js` once the catalog field is in use.
- Use concise ingredient-led noun phrases matching the approved six examples.
- Use sentence case: capitalize the opening word and all proper nouns or established product/style names; do not title-case every ingredient.
- Keep descriptions concrete, appetizing, and scannable rather than promotional or flowery.
- Avoid repeating the recipe title verbatim.
- Keep length suitable for two planner-card lines on desktop and the intended mobile clamp.
- Add schema and validation coverage so all 36 recipes have non-empty, correctly cased descriptions.

## Execution Phases

### Phase 1 - Build the UI audit matrix

Inspect the rendered interface before editing and record issues by shared component.

Views and states:

- Week planner: populated days, empty days, unscheduled tray, delivery summary, week picker, meal menu, move dialog, and toast.
- Recipes: recommendations, list view, grid view, filters, sorting, empty results, selected/added states, and load-more state.
- Recipe detail: hero, actions, ingredient disclosure, stage cards, family guidance, long titles, and print layout.
- Groceries: delivery groups, checked/have states, section filters, long ingredient names, totals, and empty states.
- Catalog/pantry: table, section badges, search/filter controls if present, and narrow overflow behavior.
- Global shell: logo, utility controls, primary navigation, week controls, headings, focus states, and dialogs.

Viewport matrix:

- 1440 x 900 desktop
- 1024 x 768 compact desktop/tablet landscape
- 820 x 1180 tablet portrait
- 760 x 900 breakpoint boundary
- 520 x 900 narrow browser
- 390 x 844 phone
- 320px width stress check

Audit categories:

- Icon centering and icon-to-label gaps
- Equivalent control heights and touch-target sizes
- Horizontal and vertical alignment
- Internal padding, section spacing, and rhythm between sections
- Border, radius, shadow, and active/hover/focus consistency
- Text wrapping, truncation, and line-height
- Card height and action alignment under short and long content
- Horizontal overflow and content hidden beneath controls
- Keyboard focus, semantic state, and dialog behavior

Deliverable: a concise issue ledger grouped by reusable selector/component, not a list of isolated screenshots.

#### Phase 1 audit ledger - completed 2026-07-14

Shared findings from rendered desktop and mobile inspection:

- Mobile navigation is fixed at the bottom at 390px, measures 58-62px high, overlays the viewport, and is paired with duplicate bottom-padding and page-fade rules.
- The latest navigation layer and earlier responsive layer both style the same mobile dock, which makes its height, radius, and shadow vary by active view.
- Utility buttons render at 32px high on phone while week controls use 44px and the dock uses 56px; the visual hierarchy does not explain that spread.
- Recipe actions render at 28px, view toggles at 34px, list thumbnails at 40px, grocery state buttons at 32px, and rating stars at 19 x 22px. Equivalent action families therefore lack a common control metric.
- Transparent recipe-title buttons collapse to one or two text line boxes, so their clickable height and vertical alignment change with title length.
- SVGs are geometrically centered inside explicit wrappers. Apparent icon drift is concentrated in controls whose parent uses an inconsistent line box, display mode, or height.
- Mobile planner meal menus use a reliable 44px icon target, providing the reference pattern for icon-only controls.
- The catalog table intentionally remains 680px wide inside `.catalog-table-wrap`; containment is working, but the narrow view needs a clearer scroll affordance and steadier surrounding spacing.
- No page-level horizontal overflow was found in Week, Recipes, or Groceries at 390px. Catalog overflow is contained by its table wrapper.
- Recipe cards mix content-driven title heights with fixed media/action dimensions, causing uneven action alignment between one-line and two-line titles.
- Spacing and radius values are repeated across late CSS layers, including several one-line overrides, increasing the chance of breakpoint-specific drift.

The corrective order is: remove the dock and duplicate mobile rules; establish control and icon metrics; normalize title/action alignment; then refine view composition and contained-table affordance.

### Phase 2 - Replace the floating mobile dock

- Consolidate the overlapping mobile navigation CSS.
- Return `.app-nav` to normal document flow at mobile widths.
- Remove dock-only fixed positioning, transforms, blur, elevated shadow, bottom fade, and body padding.
- Rebalance the week/context container so navigation and week selection read as one coherent browser-page header.
- Preserve active states, grocery count badge, accessible names, and 44px touch targets.
- Verify every primary destination and browser back/forward behavior.

Gate: no content is obscured at the bottom of 320px, 390px, 520px, or 760px views, and the mobile page ends naturally after its content.

### Phase 3 - Establish shared component metrics

- Define or normalize shared sizes for compact controls, standard controls, icon-only controls, and touch targets.
- Normalize SVG display, line box behavior, icon wrappers, and optical offsets only where an individual glyph genuinely needs one.
- Standardize button/select/input heights within each toolbar or action family.
- Normalize radii, border colors, focus rings, and disabled states.
- Normalize the spacing scale used by global shell, section bands, panels, cards, rows, and inline metadata.
- Remove duplicated or contradictory CSS declarations made obsolete by the shared rules.

Gate: equivalent components measure consistently in the audit matrix, and keyboard focus remains visible.

### Phase 4 - Review and refine each view

Apply the shared system, then address view-specific composition issues.

1. Global shell and week context
2. Week planner and meal actions
3. Recipe recommendations, list, and grid
4. Recipe detail and ingredient/method layout
5. Groceries and delivery cards
6. Catalog/pantry table
7. Dialogs, menus, toasts, empty states, and print

For each view:

- Compare short and long content.
- Check compact and wide layouts.
- Check default, hover, focus, active, disabled, selected, and open states where applicable.
- Prefer a generic rule; document any necessary exception.

Gate: each view passes its relevant desktop, tablet, phone, and keyboard checks before moving on.

### Phase 5 - Extend planner descriptions to all recipes

- Draft descriptions in catalog order for all 36 recipes.
- Preserve the culinary specificity of the six approved examples while correcting them to sentence case.
- Editorially review ingredient accuracy against each recipe's canonical ingredients and method.
- Add the field to the recipe schema.
- Update normalization and rendering to use the catalog field.
- Remove `plannerMenuDescriptions` and any fallback that would silently hide missing catalog copy.
- Add validation for presence, type, whitespace, reasonable length, and sentence-case opening.

Gate: all 36 recipes render an accurate description; none begin with an unintended lowercase letter; proper nouns retain correct casing; no old six-entry override remains.

### Phase 6 - Regression and acceptance pass

Automated checks:

- `npm run validate:recipes`
- JavaScript syntax/parsing checks for changed scripts
- `git diff --check`
- Search for removed dock-only rules and the obsolete description map
- Programmatic viewport checks for page-level horizontal overflow
- Console error check on every primary view

Rendered checks:

- Run the full viewport matrix on every primary view.
- Spot-check representative short and long recipes in planner cards.
- Open at least one recipe detail at every viewport.
- Exercise navigation, week selection, recipe opening/closing, meal actions, grocery toggles, filters, disclosures, and dialogs.
- Check print preview for recipe detail.

Final acceptance criteria:

- Mobile navigation feels like part of a web page and never overlays content.
- All equivalent controls have intentional, consistent sizing.
- Icons appear centered in their containers at desktop and mobile sizes.
- Spacing and alignment follow a coherent rhythm across all views.
- No tested viewport has page-level horizontal overflow.
- All interactive states remain keyboard accessible and visibly focused.
- All 36 recipes have accurate, sentence-case planner descriptions.
- Recipe validation, syntax checks, console checks, and `git diff --check` pass.

## Expected Files

- `styles.css` - navigation change, component metrics, spacing, and view refinements
- `index.html` - only if semantic structure or shared wrappers need adjustment
- `app.js` - navigation/render cleanup and catalog description consumption
- `data/recipes.js` - 36 authored planner descriptions
- `data/recipe.schema.json` - description contract
- `scripts/validate-recipes.mjs` - description validation
- This plan - progress notes and final verification results

## Change Discipline

- Keep the working site usable at the end of every phase.
- Do not solve shared problems with recipe-ID-specific or one-off viewport rules.
- Do not rewrite recipe cooking instructions during the planner-description pass.
- Preserve the approved structured recipe relationships and embedded completion-cue pattern.
- Update this document with completed gates and verification evidence as execution proceeds.

## Execution Record - completed 2026-07-14

### Phase results

- Phase 1 complete: the audit ledger above records the shared navigation, control-size, title-height, icon-container, table-containment, and CSS-layer findings.
- Phase 2 complete: mobile navigation is in normal document flow; dock positioning, page-bottom fade, dock shadows, safe-area anchoring, and reserved bottom padding were removed.
- Phase 3 complete: shared compact, standard, and 44px touch metrics now govern utility controls, navigation, filters, toggles, recipe actions, grocery actions, title targets, rating controls, and dialog controls. Explicit icon wrappers use centered zero-line-height boxes.
- Phase 4 complete: the global shell, planner, recipe library, recipe detail, groceries, catalog, week picker, meal dialog, ingredient disclosure, empty search-equivalent state, load-more state, and narrow table containment were reviewed. Recipe detail hides the week navigation at mobile widths to keep the cooking page focused.
- Phase 5 complete: all 36 recipes have an authored `plannerDescription`; the six prototype strings were corrected to sentence case; `app.js` consumes catalog copy directly; the override map was removed; schema and validator coverage were added.
- Phase 6 complete: automated, rendered, responsive, console, and interaction checks passed as recorded below.

### Verification evidence

- Recipe validation: 36 recipes, 130 stages, and 302 actions passed.
- Description validation: 36 present, zero lowercase openings, zero values over 160 characters, and no leading or trailing whitespace.
- JavaScript/data parsing: `app.js` syntax OK, `data/recipes.js` syntax OK, and `data/recipe.schema.json` JSON OK.
- Responsive matrix: 35 route/viewport checks passed - Week, Recipes, Groceries, Catalog, and Beef Tacos recipe detail at 1440x900, 1024x768, 820x1180, 760x900, 520x900, 390x844, and 320x780.
- Every matrix route matched its expected active view and produced no page-level horizontal overflow.
- Navigation remained `position: static` at every width. Recipe detail hid the week bar at 760px and below and retained it above that breakpoint.
- Ingredient disclosure expanded and collapsed with correct `aria-expanded` state.
- Recipe List/Grid switching worked, and Load more increased visible recipes from 12 to 24.
- The week picker opened and closed with Escape.
- The planner meal dialog opened and closed with consistent 44-76px controls.
- A grocery Need/Have toggle changed state and was toggled back to restore the original planner data.
- Browser console check returned no errors or warnings.
- `git diff --check` passed.
- The print stylesheet contract was source-reviewed: navigation and interactive controls remain hidden, complete ingredients expand, and stages/actions retain break protection. The browser-control surface did not expose the native print-preview UI for a rendered preview check.
