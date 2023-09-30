# web

## 1.7.0

### Minor Changes

- 46e520b2: feat: explicit warning not reg chula at first page (Close #623)

### Patch Changes

- 02c4acbe: fix broken build in previous release
- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
  - @cgr/course-utils@1.0.3
  - @cgr/codegen@1.2.1

## 1.7.0-beta.2

### Patch Changes

- 02c4acbe: fix broken build in previous release

## 1.7.0-beta.1

### Minor Changes

- 46e520b2: feat: explicit warning not reg chula at first page (Close #623)

## 1.6.1-beta.0

### Patch Changes

- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
  - @cgr/course-utils@1.0.3-beta.0
  - @cgr/codegen@1.2.1-beta.0

## 1.6.0

### Minor Changes

- bd18bed9: feat: add s/u filter
- bd18bed9: chore: change S/U -> S/U Grade in course detail page for consistency

### Patch Changes

- 38b30bc4: fix(web): filter params logic (from #616)

## 1.6.0-beta.1

### Patch Changes

- 38b30bc4: fix(web): filter params logic (from #616)

## 1.6.0-beta.0

### Minor Changes

- bd18bed9: feat: add s/u filter
- bd18bed9: chore: change S/U -> S/U Grade in course detail page for consistency

## 1.5.0

### Minor Changes

- 5edf7f1d: add S/U field in course page

## 1.5.0-beta.0

### Minor Changes

- 5edf7f1d: add S/U field in course page

## 1.4.2

### Patch Changes

- aaa57bc1: Fix midterm exam date displays as final exam

## 1.4.2-beta.0

### Patch Changes

- aaa57bc1: Fix midterm exam date displays as final exam

## 1.4.1

### Patch Changes

- eabd6fa8: Fix term selector out of sync
- ff59d7bb: fix empty exam date display

## 1.4.1-beta.0

### Patch Changes

- eabd6fa8: Fix term selector out of sync

## 1.4.0

### Minor Changes

- e09e36f0: add 66/2 and set current to 66/1

## 1.4.0-beta.0

### Minor Changes

- e09e36f0: add 66/2 and set current to 66/1

## 1.3.3

### Patch Changes

- 5f27c74d: add semester 2566/1

## 1.3.3-beta.0

### Patch Changes

- 5f27c74d: add semester 2566/1

## 1.3.2

### Patch Changes

- 54265779: add 2565/ฤดูร้อน semester

## 1.3.2-beta.0

### Patch Changes

- 54265779: add 2565/ฤดูร้อน semester

## 1.3.1

### Patch Changes

- 7be734a2: make exam period and period fields nullable in graphql
- 7be734a2: remove calendarId stuffs and fix type in course cart
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/codegen@1.2.0
  - @cgr/course-utils@1.0.2

## 1.3.1-beta.0

### Patch Changes

- 7be734a2: make exam period and period fields nullable in graphql
- 7be734a2: remove calendarId stuffs and fix type in course cart
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/codegen@1.2.0-beta.0
  - @cgr/course-utils@1.0.2-beta.0

## 1.3.0

### Minor Changes

- e1b5095b: upgrade to node 18

### Patch Changes

- 15dfbfca: Disable linting during Next.js builds

## 1.3.0-beta.1

### Minor Changes

- e1b5095b: upgrade to node 18

## 1.2.2-beta.0

### Patch Changes

- 15dfbfca: Disable linting during Next.js builds

## 1.2.1

### Patch Changes

- 28a2d5ba: Include .prettierrc.js during web build

## 1.2.1-beta.0

### Patch Changes

- 28a2d5ba: Include .prettierrc.js during web build

## 1.2.0

### Minor Changes

- 4af83ff9: update eslint config, fixed eslint error

### Patch Changes

- 0f2fab86: update prettier pipeline and import order

## 1.2.0-beta.0

### Minor Changes

- 4af83ff9: update eslint config, fixed eslint error

### Patch Changes

- 0f2fab86: update prettier pipeline and import order

## 1.1.1

### Patch Changes

- 27e6047a: Correct typo in Google One Tap ITP config
- df88b4db: Fix TypeScript 4.7 unsupported feature introduced in "Hotfix typo in Google One Tap ITP config"

## 1.1.1-beta.0

### Patch Changes

- 27e6047a: Correct typo in Google One Tap ITP config
- df88b4db: Fix TypeScript 4.7 unsupported feature introduced in "Hotfix typo in Google One Tap ITP config"

## 1.1.0

### Minor Changes

- b305b2eb: Implement Google One Tap sign-in

### Patch Changes

- 4be13030: Disable Google One Tap for ITP browsers
- cb53b4cf: Retain console.log in non-production environments
- 904d9bc6: Enable auto sign in flow
- c99965cf: Wait for userStore to initialize before prompting Google One Tap
- Updated dependencies [fe018c1e]
  - @cgr/codegen@1.1.0
  - @cgr/course-utils@1.0.1

## 1.1.0-beta.1

### Patch Changes

- 4be13030: Disable Google One Tap for ITP browsers
- cb53b4cf: Retain console.log in non-production environments
- 904d9bc6: Enable auto sign in flow
- c99965cf: Wait for userStore to initialize before prompting Google One Tap
- Updated dependencies [fe018c1e]
  - @cgr/codegen@1.1.0-beta.0
  - @cgr/course-utils@1.0.1-beta.0

## 1.1.0-beta.0

### Minor Changes

- b305b2eb: Implement Google One Tap sign-in

## 1.0.1

### Patch Changes

- ee359408: add lib to web dockerfile

## 1.0.1-beta.0

### Patch Changes

- ee359408: add lib to web dockerfile

## 1.0.0

### Major Changes

- aecb4781: 4 Feb 2023, we're excited to announce the release of the new version of the course registration system, CU Get Reg. This release includes a number of new features, including:

  - Searching for courses by course code or course name
  - Planning your schedule with a course planner
  - Migrate to Turborepo for monorepo management
  - Scrape course data from Reg Chula and Office of Academic Affairs
  - Course recommendation based on your selected course history
  - Review and rate the courses
  - Codegen for generating GraphQL schema and TypeScript types
  - Shared ESLint and Typescript config for consistent code style

### Patch Changes

- Updated dependencies [aecb4781]
  - @cgr/course-utils@1.0.0
  - @cgr/codegen@1.0.0
