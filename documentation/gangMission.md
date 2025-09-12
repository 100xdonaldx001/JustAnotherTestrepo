# Gang Missions

Gang missions are high-risk tasks undertaken with your gang. Outcomes are determined by configurable probabilities in `scripts/taskChances.js` under `taskChances.gang`.

## Outcomes
- **Success:** `taskChances.gang.missionSuccess` decides if the mission succeeds. A successful mission awards between $500 and $2,000, which is added to your money balance.
- **Failure:** If the mission fails, `taskChances.gang.jailOnFail` is checked.
  - **Jail:** You may be jailed for 1–3 years, preventing other actions.
  - **Injury:** If you avoid jail, your health drops by 5–15 points.

## Related Mechanics
- **Health:** Injuries from failed missions reduce health, possibly impacting future activities.
- **Money:** Successful missions increase your cash reserves.
- **Gang Reputation:** Each gang tracks a reputation value. While missions do not currently change reputation, they can be extended to raise or lower it based on success or failure.

Adjust the probabilities in `taskChances.gang` to balance mission difficulty and risk.
