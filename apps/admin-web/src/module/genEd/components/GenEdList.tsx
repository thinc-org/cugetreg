import { useState } from 'react'

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Typography } from '@mui/material'

import { Override, useGetOverridesQuery } from '@cgr/codegen'

import { GenEdTableBody } from '../styled'

export function GenEdList() {
  const { data, loading, error } = useGetOverridesQuery()

  if (loading) return null

  const handleDelete = (course: Override) => {
    // TODO: call API for deleting and fetch new data
    console.log(course.courseNo)
  }

  return (
    <div>
      {data?.overrides.map((courseData: Override) => {
        return (
          <GenEdTableBody
            key={`${courseData.courseNo}${courseData.semester}${courseData.studyProgram}`}
          >
            <Typography sx={{ fontWeight: 700 }}>{courseData.genEd?.genEdType}</Typography>
            <Typography sx={{ fontWeight: 700 }}>{courseData.courseNo}</Typography>
            <Typography sx={{ fontWeight: 700, justifySelf: 'start' }}>
              {courseData.courseNo}
            </Typography>
            <Typography></Typography>
            <DeleteOutlinedIcon sx={{ fontSize: 24 }} onClick={() => handleDelete(courseData)} />
            {/* <GenEdCreditContainer>
                <Typography sx={{ fontWeight: 700, justifySelf: 'center' }}>
                  {courseData.courseNo}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}></Typography>
              </GenEdCreditContainer> */}
          </GenEdTableBody>
        )
      })}
    </div>
  )
}

// TODO: Remove Mock Data
// const data = {
//   courseNo: '0123101',
//   genEd: {
//     genEdType: 'HU',
//   },
//   credit: '3 (3-0-6)',
//   courseName: 'Paragraph Writing',
// }
