import { ICourseSearchFilter } from '@api/course/course.resolver'

// build the query
export function buildCourseQuery(filter: ICourseSearchFilter): Record<string, any> {
  // create the base query from values that guarantee is not undefined
  const boolMust: Record<string, any>[] = []

  if (filter.keyword) {
    boolMust.push({
      multi_match: {
        query: filter.keyword,
        fields: [
          'abbrName^5',
          'courseNo^5',
          'courseNameEn^3',
          'courseDescEn',
          'courseNameTh^3',
          'courseDescTh',
        ],
      },
    })
  }

  const sectionsQuery: Record<string, any>[] = []

  // push the query for each filter if filter is not undefined
  if (filter.dayOfWeeks?.length > 0) {
    sectionsQuery.push({
      terms: {
        'rawData.sections.classes.dayOfWeek': filter.dayOfWeeks,
      },
    })
  }

  if (filter.periodRange) {
    sectionsQuery.push({
      nested: {
        path: 'rawData.sections.classes.period',
        query: {
          query_string: {
            query: `rawData.sections.classes.period.start:[${filter.periodRange.start} TO ${filter.periodRange.end}] AND rawData.sections.classes.period.end:[* TO ${filter.periodRange.end}]`,
          },
        },
      },
    })
  }

  if (filter.genEdTypes?.length > 0) {
    boolMust.push({
      terms: {
        genEdType: filter.genEdTypes,
      },
    })
  }

  if (sectionsQuery.length > 0) {
    boolMust.push({
      nested: {
        path: 'rawData',
        query: {
          nested: {
            path: 'rawData.sections',
            query: {
              nested: {
                path: 'rawData.sections.classes',
                query: {
                  bool: {
                    must: sectionsQuery,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  const result: Record<string, any> = {
    bool: {
      filter: [
        {
          term: {
            semester: {
              value: filter.semester,
            },
          },
        },
        {
          term: {
            studyProgram: {
              value: filter.studyProgram,
            },
          },
        },
        {
          term: {
            academicYear: {
              value: filter.academicYear,
            },
          },
        },
      ],
    },
  }

  if (boolMust.length > 0) {
    result['bool'] = { must: boolMust }
  }

  return result
}
