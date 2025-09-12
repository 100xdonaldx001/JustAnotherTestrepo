# Leaving a Gang

Players may leave their current gang only when they meet all of the following conditions:

- No gang-specific missions are in progress.
- There are no pending tasks or timers tied to the gang.
- Any cooldown period for leaving has expired.

When a player exits a gang, clean up their gang state:

1. Remove the player from the gang roster.
2. Reset gang-related statistics and timers to defaults.
3. Clear all gang perks and crime modifiers from the player.
4. Log a message noting the gang departure.

Leaving a gang has gameplay consequences:

- Crime modifiers provided by the gang are no longer applied.
- Missions tied to the former gang become unavailable until the player joins a new one.

