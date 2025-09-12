# Car Maintenance Scheduling

Scheduling maintenance keeps cars in working order and protects their value.

## Maintenance Cost Calculation
- The cost for each car is 5% of its current value, capped at $500.
- Funds are deducted only if the player can afford the cost.

## Maintenance Outcomes
- **Success:** Maintenance succeeds when a random roll is within the configured success chance. The car's value stays the same.
- **Failure:** If the roll exceeds the success chance, maintenance fails and the car loses 10% of its value.

## Handling Limitations
- **Insufficient Funds:** When the player lacks enough money, maintenance for that car is skipped and a warning is logged.
- **No Cars:** If the player owns no cars, the action immediately returns with a message that no maintenance is needed.

