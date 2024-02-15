# api

## 1.8.0-beta.1

### Patch Changes

- c0e5777: feat: next 14 and minor dependencies
- Updated dependencies [c0e5777]
  - @cgr/schema@1.4.0-beta.1

## 1.8.0-beta.0

### Minor Changes

- 4f342ee: deps: upgrade to node 20 and bump all patch-minor

### Patch Changes

- Updated dependencies [4f342ee]
  - @cgr/schema@1.4.0-beta.0

## 1.7.0

### Minor Changes

- 9b7de076: chore: bump deps and webpack
- 61d07e46: chore: bump patch and minor deps

### Patch Changes

- Updated dependencies [61d07e46]
  - @cgr/schema@1.3.0

## 1.7.0-beta.0

### Minor Changes

- 9b7de076: chore: bump deps and webpack
- 61d07e46: chore: bump patch and minor deps

### Patch Changes

- Updated dependencies [61d07e46]
  - @cgr/schema@1.3.0-beta.0

## 1.6.0

### Minor Changes

- 7282ea1e: Enhance search engine with Elasticsearch
- 79af67e9: bump mongoose to 6.12 (fix vulnerabilities)

### Patch Changes

- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
- Updated dependencies [79af67e9]
  - @cgr/schema@1.2.0

## 1.6.0-beta.0

### Minor Changes

- 7282ea1e: Enhance search engine with Elasticsearch
- 79af67e9: bump mongoose to 6.12 (fix vulnerabilities)

### Patch Changes

- 8d9d304b: bump eslint and fix ci
- Updated dependencies [8d9d304b]
- Updated dependencies [79af67e9]
  - @cgr/schema@1.2.0-beta.0

## 1.5.0

### Minor Changes

- bd18bed9: feat: add s/u filter

## 1.5.0-beta.0

### Minor Changes

- bd18bed9: feat: add s/u filter

## 1.4.2

### Patch Changes

- Updated dependencies [a4ecf786]
  - @cgr/schema@1.1.1

## 1.4.2-beta.0

### Patch Changes

- Updated dependencies [a4ecf786]
  - @cgr/schema@1.1.1-beta.0

## 1.4.1

### Patch Changes

- 85f089b2: fix override module to support new schema
- Updated dependencies [85f089b2]
  - @cgr/schema@1.1.0

## 1.4.1-beta.0

### Patch Changes

- 85f089b2: fix override module to support new schema
- Updated dependencies [85f089b2]
  - @cgr/schema@1.1.0-beta.0

## 1.4.0

### Minor Changes

- 7be734a2: - migrate graphql from apollo-server-express to @apollo/server
  - use common types from `@cgr/schema`
  - refactor api to be consistent across modules
  - throw `GraphQLError`s instead of `HttpException`s in resolvers and services
  - validate graphql date parsing and serialization
- 7be734a2: make exam period and period fields nullable in graphql

### Patch Changes

- 7be734a2: - add constant model names
  - add CourseCartItem type
- 7be734a2: remove calendarId stuffs and fix type in course cart
- 7be734a2: upgrade dependencies
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/schema@1.0.0

## 1.4.0-beta.0

### Minor Changes

- 7be734a2: - migrate graphql from apollo-server-express to @apollo/server
  - use common types from `@cgr/schema`
  - refactor api to be consistent across modules
  - throw `GraphQLError`s instead of `HttpException`s in resolvers and services
  - validate graphql date parsing and serialization
- 7be734a2: make exam period and period fields nullable in graphql

### Patch Changes

- 7be734a2: - add constant model names
  - add CourseCartItem type
- 7be734a2: remove calendarId stuffs and fix type in course cart
- 7be734a2: upgrade dependencies
- Updated dependencies [7be734a2]
- Updated dependencies [7be734a2]
  - @cgr/schema@1.0.0-beta.0

## 1.3.0

### Minor Changes

- 21122935: fix stack field in log file being array instead of string causing elastic to failed parsing it
- e1b5095b: upgrade to node 18

### Patch Changes

- 76659ecb: send review alert on create review

## 1.3.0-beta.0

### Minor Changes

- 21122935: fix stack field in log file being array instead of string causing elastic to failed parsing it
- e1b5095b: upgrade to node 18

### Patch Changes

- 76659ecb: send review alert on create review

## 1.2.0

### Minor Changes

- 4af83ff9: update eslint config, fixed eslint error

### Patch Changes

- 3b6b100e: check hosted domain for authorization code flow
- 0f2fab86: update prettier pipeline and import order

## 1.2.0-beta.0

### Minor Changes

- 4af83ff9: update eslint config, fixed eslint error

### Patch Changes

- 3b6b100e: check hosted domain for authorization code flow
- 0f2fab86: update prettier pipeline and import order

## 1.1.1

### Patch Changes

- 313b9e75: Avoid SQL injection and XSS by upgrading class-validtor to version 0.14.0

## 1.1.1-beta.0

### Patch Changes

- 313b9e75: Avoid SQL injection and XSS by upgrading class-validtor to version 0.14.0

## 1.1.0

### Minor Changes

- b305b2eb: Add support for signing in with Google ID Token

## 1.1.0-beta.0

### Minor Changes

- b305b2eb: Add support for signing in with Google ID Token

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
