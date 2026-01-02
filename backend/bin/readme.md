Download courses.json,
overrides.json,
reviews.json,
users.json
and place in this folder then
1.pnpm tsx migrate_course.ts
2.pnpm tsx migrate_user.ts
3.pnpm tsx migrate_review.ts

!if process.env.DATABASE_URL not load use string instead
