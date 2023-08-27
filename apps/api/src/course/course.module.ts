import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SearchModule } from '@api/search/search.module'

import { CourseSchema, ModelName } from '@cgr/schema'

import { CourseResolver } from './course.resolver'
import { CourseService } from './course.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.Course, schema: CourseSchema }]),
    SearchModule,
  ],
  providers: [CourseResolver, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
