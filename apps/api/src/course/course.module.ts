import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CourseSchema, ModelName } from '@cgr/schema'

import { CourseResolver } from './course.resolver'
import { CourseService } from './course.service'
import { SearchModule } from '@api/search/search.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'course', schema: CourseSchema }]), SearchModule],
  providers: [CourseResolver, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
