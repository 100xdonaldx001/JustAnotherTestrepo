# Weekend Event

The `weekendEvent` simulates a random weekend experience each year.

- When it goes well, it can increase **happiness**.
- Sometimes it improves **health** instead.
- A dull weekend imposes a **boredom penalty** that lowers happiness.

Odds for each outcome are configured under `weekend` in `scripts/taskChances.js`.

The yearly `ageUp` process calls this event to keep life a little unpredictable.
