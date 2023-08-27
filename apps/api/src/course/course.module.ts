import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SearchModule } from '@api/search/search.module'

import { CourseSchema } from '@cgr/schema'

import { CourseResolver } from './course.resolver'
import { CourseService } from './course.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'course', schema: CourseSchema }]), SearchModule],
  providers: [CourseResolver, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
