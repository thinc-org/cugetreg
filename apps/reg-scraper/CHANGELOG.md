# reg-scraper

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
