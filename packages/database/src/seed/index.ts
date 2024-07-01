import { seedCourses } from './steps/courses.js'
import { pgClient } from './utils/client.js'

await seedCourses()

await pgClient.end()
