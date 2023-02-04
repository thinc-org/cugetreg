import { Class, Course, Section } from '@cgr/codegen'

export type ClassThumbnailData = Pick<Class, 'dayOfWeek'>

export type SectionThumbnailData = Pick<Section, never> & {
  classes: ClassThumbnailData[]
}

export type CourseThumbnailData = Pick<
  Course,
  'courseNo' | 'abbrName' | 'courseNameTh' | 'courseNameEn' | 'genEdType'
> & {
  sections: SectionThumbnailData[]
}
