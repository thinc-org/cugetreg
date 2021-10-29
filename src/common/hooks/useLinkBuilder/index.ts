import { useMemo } from 'react'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { CourseGroup } from '@/common/hooks/useCourseGroup/types'
import { LinkBuilder } from '@/common/hooks/useLinkBuilder/types'
import { Term } from '@/common/types/term'
import { getCurrentTerm } from '@/common/utils/getCurrentTerm'

class LinkBuilderImpl implements LinkBuilder {
  private courseGroup: CourseGroup
  private latestTerm: Term

  constructor(courseGroup: CourseGroup) {
    this.courseGroup = courseGroup
    this.latestTerm = getCurrentTerm()
  }

  buildLink = (href: string, params: Record<string, string> = {}, includeStudyProgram: boolean = true): string => {
    const urlParams = new URLSearchParams(params)
    if (
      this.courseGroup.academicYear !== this.latestTerm.academicYear ||
      this.courseGroup.semester !== this.latestTerm.semester
    ) {
      urlParams.set('term', `${this.courseGroup.academicYear}/${this.courseGroup.semester}`)
    }
    let link = ''
    if (includeStudyProgram) {
      link += `/${this.courseGroup.studyProgram}`
    }
    link += href
    const paramsString = urlParams.toString()
    if (paramsString !== '') {
      link += `?${paramsString}`
    }
    return link
  }
}

export function useLinkBuilder(): LinkBuilder {
  const courseGroup = useCourseGroup()
  return useLinkBuilderWithCourseGroup(courseGroup)
}

export function useLinkBuilderWithCourseGroup(courseGroup: CourseGroup): LinkBuilder {
  return useMemo(() => new LinkBuilderImpl(courseGroup), [courseGroup])
}
