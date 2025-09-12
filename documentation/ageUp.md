# Age Up Yearly Progression

The `ageUp` action advances the game by one year. Each tick walks through a sequence of events that update the player's life and related systems.

## Yearly Sequence

- Increment age and year, then advance school and update parents.
- Adjust health and happiness; resolve sickness.
- Pay job salary and pensions, then collect investment dividends and savings interest.
- Run random and disaster events, tick the job system, economy phase, and trigger a weekend event.
- Update real estate holdings, stock portfolio, and rentals; compute taxes and tick businesses.
- Age children, parents, siblings, and pets; handle job promotions and achievements.
- Progress active diseases and run jail, relationship, and spouse ticks.
- Check for death when age exceeds `maxAge` or health reaches zero.

## Module Dependencies

- **job**: `paySalary()` adds yearly pay while `tickJob()` and promotion logic update experience and title.
- **school**: `advanceSchool()` and `accrueStudentLoanInterest()` move education forward and apply loan costs.
- **realestate**: `tickRealEstate()` manages property income and maintenance, feeding into tax calculations.
- **investment**: `calculateDividend()` and `tickStocks()` produce dividends and portfolio growth.
- **weekend**: `weekendEvent()` injects leisure events that can affect health, happiness, or finances.
- **elderCare**: `tickParents()` ages parents and may distribute inheritance when they pass.
- **traffic**: commute events like `checkForAccident()` can trigger during random or weekend events, influencing health or money.

These modules interlink through shared game state: earnings influence taxes and savings, education shapes job outcomes, and events from one system ripple into others, forming a cohesive yearly progression.
