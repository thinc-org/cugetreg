import { seedCarts } from './steps/cart.js'
import { seedClasses } from './steps/classes.js'
import { seedCourses } from './steps/courses.js'
import { seedReviews } from './steps/review.js'
import { seedSections } from './steps/sections.js'
import { seedUsers } from './steps/users.js'
import { pgClient } from './utils/client.js'

await seedCourses()
await seedSections()
await seedClasses()

// #region User Data
await seedUsers()
await seedReviews()
await seedCarts()
// #endregion User Data

await pgClient.end()
