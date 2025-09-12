# Hitting the Gym

## Costs
- Visiting the gym costs $20 and reduces money accordingly.
- Working out in jail has no monetary cost.

## Stat Gains
- Each session increases health by 2-5 and happiness by 1-3.
- The action uses state.js's `applyAndSave()` to update `game.health`, `game.happiness`, and, when not jailed, `game.money`.

## Jail Workouts
- If `game.inJail` is true, the character works out in the yard and gains stats without paying.

## Failure Cases
- If funds are below $20, the workout is cancelled and a log message explains the shortage.

## State Connections
- `state.js` defines the `game` state including `health`, `happiness`, and `money`.
- The `applyAndSave()` helper in `state.js` commits the gym updates and saves the game.

