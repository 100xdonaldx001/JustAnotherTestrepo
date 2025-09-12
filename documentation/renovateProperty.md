# Renovating Properties

The `renovateProperty` action lets players invest money to upgrade a property. It performs several checks and updates the property and game state.

## Permit verification
Renovations require a permit. The function rolls against `taskChances.renovation.permitApproval`. A failed roll logs that the permit was denied and the renovation does not start.

## Cost and state changes
When approved, the renovation cost is rounded and deducted from `game.money`. The property's rental status resets: it is marked unrented, rent is set to 0, and any tenant is removed.

## Renovation timer
The property gains a `renovation` object with the number of years and cost. Each yearly tick of the real estate system reduces the timer until completion, at which point value increases accordingly.

## Integration with other systems
This action modifies the property state object directly and interacts with tenant management by evicting current tenants. Its permit check ties into the configurable random event chances defined in `taskChances.js`, allowing balance through tuning.

