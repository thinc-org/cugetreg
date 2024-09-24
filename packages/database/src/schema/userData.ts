import { createId } from '@paralleldrive/cuid2'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { semester, studyProgram } from './types.js'

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text('email').notNull().unique(),

  name: text('name').notNull(),
  image: text('image'),
  googleId: text('google_id').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const cart = pgTable('cart', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),

  studyProgram: studyProgram('study_program').notNull(),
  academicYear: integer('academic_year').notNull(),
  semester: semester('semester').notNull(),

  name: text('name').notNull().default('Untitled'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const cartItem = pgTable('cart_item', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  cartId: text('cart_id')
    .notNull()
    .references(() => cart.id),

  courseNo: text('course_no').notNull(),
  sectionNo: integer('section_no').notNull(),
  color: text('color'),
  hidden: boolean('hidden').notNull().default(false),
  cartOrder: integer('cart_order').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const reviewStatus = pgEnum('review_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
])

export const review = pgTable('review', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),

  studyProgram: studyProgram('study_program').notNull(),
  academicYear: integer('academic_year').notNull(),
  semester: semester('semester').notNull(),

  courseNo: text('course_no').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),

  status: reviewStatus('status').notNull().default('PENDING'),
  rejectionReason: text('rejection_reason'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const voteType = pgEnum('vote_type', ['L', 'D'])

export const reviewVotes = pgTable('review_votes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  reviewId: text('review_id')
    .notNull()
    .references(() => review.id),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),

  voteType: voteType('vote_type').notNull(),
})
