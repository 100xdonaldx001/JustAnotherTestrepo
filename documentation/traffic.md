# Traffic Outcomes

`checkForAccident` handles random events that occur while commuting by car.

## Possible results

- **Cash find**: If no accident happens, there is a chance to discover a small amount of money.
- **Traffic fine**: Accidents without injuries result in a fine that reduces money.
- **Injury**: Some accidents cause health loss.

Probabilities for these results are defined in `taskChances.traffic`.

## Invocation from job actions

`commute()` in `scripts/actions/job.js` calls `checkForAccident` before work-related tasks such as receiving salary or working extra.
The function only runs when the player owns a car (`game.cars`), exposing car owners to traffic outcomes during job commutes.

