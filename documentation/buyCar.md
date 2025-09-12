# Buying a Car

Buying a car deducts its purchase price from your funds and adds the vehicle to your state.

## Negotiation Discount Chances
- Each purchase checks `taskChances.cars.dealDiscount` for a 10% price cut.
- Successful haggling logs a discount message.

## Purchase Costs and Storage
- If you cannot cover the adjusted price, the sale is denied.
- Purchased cars are stored in `game.cars` with their final value.

## Relationships to Other Systems
- `scheduleMaintenance` services every owned car, charging up to 5% of its value.
- Commuting with a car triggers accident checks via `checkForAccident`, making maintenance and safety important.
