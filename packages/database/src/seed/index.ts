import { seedClasses } from './steps/classes.js'
import { seedCourses } from './steps/courses.js'
import { seedSections } from './steps/sections.js'
import { pgClient } from './utils/client.js'

await seedCourses()
await seedSections()
await seedClasses()

await pgClient.end()
