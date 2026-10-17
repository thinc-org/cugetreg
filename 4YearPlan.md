# 4YearPlan API

Routes for the 4 year study plan feature, built on the `Curriculum`, `CurriculumCategory`, `CurriculumRequirement`, `OfficialCreditTarget`, `StudyPlan`, `PlanCategory`, `StudyPlanItem`, and `CustomCreditTarget` models in `schema.prisma`.

## Study plan routes

All routes live under `/study-plans` and require auth.

| Method | Path | What it does |
|---|---|---|
| GET | `/study-plans` | Lists the current user's plans. |
| POST | `/study-plans` | Creates a plan. With a `curriculumId`, it copies the curriculum's categories into `PlanCategory`, its credit targets into `CustomCreditTarget`, and its required courses into `StudyPlanItem`. Without one, the plan starts empty. `curriculumId` cannot change after creation. |
| GET | `/study-plans/{planId}` | Returns the plan with its categories, credit targets, and items. |
| PATCH | `/study-plans/{planId}` | Renames the plan. |
| PATCH | `/study-plans/{planId}/pin` | Sets this plan as the user's default, clearing the flag on any other plan. |
| POST | `/study-plans/{planId}/terms` | Adds one more regular term past the base 4 years / 8 terms. Increments `extraTerms`; it does not create any items. |
| PATCH | `/study-plans/{planId}/custom-credit-targets/{creditTargetId}` | Edits a `CustomCreditTarget` row. |
| POST | `/study-plans/{planId}/items` | Adds a course to a term by course number. Links to a matching `CurriculumRequirement` when one exists for that course, year, and semester. Rejects duplicates in the same plan. |
| GET | `/study-plans/{planId}/cart-candidates?semester=` | Lists the user's real schedule items for a given semester, across all their carts, excluding courses already on the plan. Matches on semester only, not academic year. |
| POST | `/study-plans/{planId}/items/from-cart` | Adds the chosen cart items to a term and category. Returns which ones were added and which were skipped for already being on the plan. |
| DELETE | `/study-plans/{planId}/items/{itemId}` | Removes a course from the plan. |
| GET | `/study-plans/{planId}/grades` | Returns items grouped by term with each term's credit total and GPA, plus the plan's overall credit total and GPAX. |
| PATCH | `/study-plans/{planId}/grades` | Batch updates grades. The grade page is expected to call this on an interval, about every 10 seconds, while the student edits, not on every keystroke. |

## Course routes (extended)

| Method | Path | What it does |
|---|---|---|
| GET | `/courses/{courseNo}/offering-history` | Groups the course's last 3 academic years of offerings by semester and flags whether it has opened in more than one semester bucket. Used by the "add course by number" picker to warn when a course's term has shifted before. |

## Confirmed decisions

The pin endpoint is "set this plan as the user's default plan," matching Cart's `isDefault` pattern, not a write-back into the real Cart/CartItem schedule.

"Add from cart" copies courses once. Editing the real schedule afterward does not update the plan, and editing the plan does not touch the cart.
