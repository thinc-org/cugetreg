# reg-scraper

## 1.4.0-beta.1

### Patch Changes

- c0e5777: feat: next 14 and minor dependencies
- Updated dependencies [c0e5777]
  - @cgr/schema@1.4.0-beta.1

## 1.4.0-beta.0

### Minor Changes

- 4f342ee: deps: upgrade to node 20 and bump all patch-minor

### Patch Changes

- Updated dependencies [4f342ee]
  - @cgr/schema@1.4.0-beta.0

## 1.3.0

### Minor Changes

- 9b7de076: chore: bump deps and webpack
- 61d07e46: chore: bump patch and minor deps

### Patch Changes

- Updated dependencies [61d07e46]
  - @cgr/schema@1.3.0

## 1.3.0-beta.0

### Minor Changes

- 9b7de076: chore: bump deps and webpack
- 61d07e46: chore: bump patch and minor deps

### Patch Changes

- Updated dependencies [61d07e46]
  - @cgr/schema@1.3.0-beta.0

## 1.2.0

### Minor Changes

- bfda7a77: use cas url instead
- 79af67e9: bump mongoose to 6.12 (fix vulnerabilities)

### Patch Changes

- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
- Updated dependencies [79af67e9]
  - @cgr/schema@1.2.0

## 1.2.0-beta.1

### Minor Changes

- bfda7a77: use cas url instead

## 1.2.0-beta.0

### Minor Changes

- 79af67e9: bump mongoose to 6.12 (fix vulnerabilities)

### Patch Changes

- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
- Updated dependencies [79af67e9]
  - @cgr/schema@1.2.0-beta.0

## 1.1.3

### Patch Changes

- a4ecf786: exit on scrape if scraper is in progress to prevent infinitely stuck scraper
- Updated dependencies [a4ecf786]
  - @cgr/schema@1.1.1

## 1.1.3-beta.0

### Patch Changes

- a4ecf786: exit on scrape if scraper is in progress to prevent infinitely stuck scraper
- Updated dependencies [a4ecf786]
  - @cgr/schema@1.1.1-beta.0

## 1.1.2

### Patch Changes

- 85f089b2: fix override module to support new schema
- Updated dependencies [85f089b2]
  - @cgr/schema@1.1.0

## 1.1.2-beta.0

### Patch Changes

- 85f089b2: fix override module to support new schema
- Updated dependencies [85f089b2]
  - @cgr/schema@1.1.0-beta.0

## 1.1.1

### Patch Changes

- 7be734a2: - add constant model names
  - add CourseCartItem type
- 7be734a2: upgrade dependencies
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/schema@1.0.0

## 1.1.1-beta.0

### Patch Changes

- 7be734a2: - add constant model names
  - add CourseCartItem type
- 7be734a2: upgrade dependencies
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/schema@1.0.0-beta.0

## 1.1.0

### Minor Changes

- e1b5095b: upgrade to node 18

## 1.1.0-beta.0

### Minor Changes

- e1b5095b: upgrade to node 18

## 1.0.3

### Patch Changes

- 0f2fab86: update prettier pipeline and import order

## 1.0.3-beta.0

### Patch Changes

- 0f2fab86: update prettier pipeline and import order

## 1.0.2

### Patch Changes

- 313b9e75: Avoid SQL injection and XSS by upgrading class-validtor to version 0.14.0

## 1.0.2-beta.0

### Patch Changes

- 313b9e75: Avoid SQL injection and XSS by upgrading class-validtor to version 0.14.0

## 1.0.1

### Patch Changes

- 772e87aa: Fix duplicate @nestjs/common entries problem by adding class validator and class transformer in all Nest apps. This is a short term solution.

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
