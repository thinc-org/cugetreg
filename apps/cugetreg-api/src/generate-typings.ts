import { GraphQLDefinitionsFactory } from '@nestjs/graphql'

import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['apps/cugetreg-api/src/**/*.graphql'],
  path: join(process.cwd(), 'apps/cugetreg-api/src/graphql.ts'),
  outputAs: 'class',
})
