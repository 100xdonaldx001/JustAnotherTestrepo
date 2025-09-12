# Retirement

## Prerequisites
- You must be at least 60 years old.
- You cannot already be retired.

## Pension calculation
- If you retire while employed, your yearly pension equals half of your current salary.
- Job salary is driven by job stats such as level, performance, and experience, so improving them can raise the pension.
- Retiring without a job results in no pension.
- You may also retire using personal savings; in this case the pension is withdrawn from your money each year instead of being provided by the government.

## State resets
- Sets `retired` to true and records whether the pension comes from savings.
- Clears the current job and resets job stats: `jobSatisfaction`, `jobPerformance`, `jobExperience`, and `jobLevel`.
- Job listings no longer appear and work-related actions become unavailable.

