# Work Extra

Working overtime lets your character earn additional money at the cost of well-being. This action interacts with several systems:

- **Approval chance**
  - Chance of approval is determined by `taskChances.jobs.overtimeApproval` combined with your job performance and happiness.
- **Overtime pay**
  - Successful requests award a random bonus of $200–$1,500.
- **Health and happiness penalties**
  - Taking overtime reduces both health and happiness by a small amount.

## Dependencies

- You must be employed and free (not in jail) to attempt overtime.
- Approval relies on values in `taskChances.js`.
- Before working, the game runs `traffic` checks. Owning a car can trigger accident events during the commute.
