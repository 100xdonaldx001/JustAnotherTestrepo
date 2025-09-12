# Visiting Parents

Visiting a parent lets you support them and boost your own mood.

## Costs
- Each visit costs $50.

## Effects
- On a successful visit:
  - Your happiness increases by 1–3.
  - Your parent’s health increases by 2–5.
- Success is determined by `taskChances.elderCare.visitSuccess` (90% by default).
- If the parent is too tired, no bonuses are gained.

## Failure Cases
- If the chosen parent has passed away, the visit is cancelled.
- If you lack the $50 fee, the visit cannot proceed.

## Related Mechanics
- The `tickParents` function ages parents yearly, reducing their health and providing an inheritance of $5,000–$20,000 if they die.
- Regular visits can offset `tickParents` health decline, delaying death and inheritance.

