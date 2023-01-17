import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import { Course, StudyProgram } from '@thinc-org/chula-courses'
import { parse } from 'csv-parse'
import * as fs from 'fs'
import { Model } from 'mongoose'

import { Override, OverrideDocument } from '@reg-scraper/schema/override.schema'
import { ReviewDocument } from '@reg-scraper/schema/review.schema'

import { findAvgRating } from './override.util'

@Injectable()
export class OverrideService {
  private logger: Logger = new Logger('OverrideService')

  private _isLoaded = false

  private courseDescriptions: Record<
    string,
    {
      th?: string
      en?: string
    }
  > = {}
  private overrides: Record<
    StudyProgram,
    Record<string, Record<string, Record<string, Override>>>
  > = {
    S: {},
    T: {},
    I: {},
  }
  private ratings: Record<StudyProgram, Record<string, string>> = {
    S: {},
    T: {},
    I: {},
  }

  constructor(
    private configService: ConfigService,
    @InjectModel('override') private overrideModel: Model<OverrideDocument>,
    @InjectModel('review') private reviewModel: Model<ReviewDocument>
  ) {}

  public get isLoaded(): boolean {
    return this._isLoaded
  }

  applyOverrides(course: Course): Course {
    if (this._isLoaded == false) {
      throw new Error('Overrides are not loaded yet')
    }
    course.courseDescTh = this.courseDescriptions[course.courseNo]?.th
    course.courseDescEn = this.courseDescriptions[course.courseNo]?.en

    course.rating = this.ratings[course.studyProgram][course.courseNo]

    const courseOverrides = this.overrides[course.studyProgram][course.courseNo]

    if (
      courseOverrides &&
      courseOverrides[course.academicYear] &&
      courseOverrides[course.academicYear][course.semester] &&
      courseOverrides[course.academicYear][course.semester].genEd
    ) {
      const { genEdType, sections: genEdSections } =
        courseOverrides[course.academicYear][course.semester].genEd
      course.genEdType = genEdType

      for (const section of course.sections) {
        section.genEdType = genEdSections.includes(section.sectionNo) ? genEdType : 'NO'
      }
    } else {
      // only use genEdType from override
      course.genEdType = 'NO'
      for (const section of course.sections) {
        section.genEdType = 'NO'
      }
    }
    return course
  }

  async reset(): Promise<void> {
    this._isLoaded = false
    await Promise.all([this.loadCourseDescriptions(), this.loadOverrides(), this.loadRatings()])
    this._isLoaded = true
  }

  async loadCourseDescriptions() {
    // no need to reload course description if already loaded, since it's very static and very large
    if (Object.keys(this.courseDescriptions).length != 0) {
      return
    }
    const path = this.configService.get<string>('courseDescPath')
    if (!path) {
      this.logger.warn('Course descriptions path not found. Skipping loading.')
      return
    }
    const parser = fs.createReadStream(path, { encoding: 'utf8' }).pipe(parse({ columns: true }))
    for await (const record of parser) {
      this.courseDescriptions[record.course_no] = {}
      if (record.description_thai != '-') {
        this.courseDescriptions[record.course_no].th = record.description_thai
      }
      if (record.description != '-') {
        this.courseDescriptions[record.course_no].en = record.description
      }
    }
    this.logger.log(`Loaded course descriptions from ${path}`)
  }

  async loadOverrides() {
    const overridesList = await this.overrideModel.find().lean()
    this.overrides = {
      S: {},
      T: {},
      I: {},
    }
    for (const override of overridesList) {
      const course = this.overrides[override.studyProgram][override.courseNo] || {}
      const academicYear = course[override.academicYear] || {}

      academicYear[override.semester] = override
      course[override.academicYear] = academicYear
      this.overrides[override.studyProgram][override.courseNo] = course
    }
    this.logger.log(`Loaded course overrides from database`)
  }

  async loadRatings() {
    const reviewsList = await this.reviewModel.find().lean()
    const reviewRatings: Record<StudyProgram, Record<string, number[]>> = {
      S: {},
      T: {},
      I: {},
    }
    for (const review of reviewsList) {
      if (!(review.courseNo in reviewRatings[review.studyProgram])) {
        reviewRatings[review.studyProgram][review.courseNo] = []
      }
      reviewRatings[review.studyProgram][review.courseNo].push(review.rating)
    }
    for (const studyProgram in reviewRatings) {
      for (const courseNo in reviewRatings[studyProgram]) {
        this.ratings[studyProgram][courseNo] = findAvgRating(reviewRatings[studyProgram][courseNo])
      }
    }
    this.logger.log(`Loaded review ratings from database`)
  }

  // For testing purpose only
  setOverrides(
    overrides: Record<StudyProgram, Record<string, Record<string, Record<string, Override>>>>
  ) {
    this.overrides = overrides
    this._isLoaded = true
  }

  getOverrides(): Record<StudyProgram, Record<string, Record<string, Record<string, Override>>>> {
    return this.overrides
  }
}
