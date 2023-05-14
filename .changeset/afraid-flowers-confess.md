---
'api': minor
---

- migrate graphql from apollo-server-express to @apollo/server
- use common types from `@cgr/schema`
- refactor api to be consistent across modules
- throw `GraphQLError`s instead of `HttpException`s in resolvers and services
- validate graphql date parsing and serialization
