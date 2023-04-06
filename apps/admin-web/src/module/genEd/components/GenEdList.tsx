import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Typography } from '@mui/material'

import { Override, useGetOverridesQuery } from '@cgr/codegen'

import { GenEdCreditContainer, GenEdTableBody } from '../styled'

export function GenEdList() {
  const { data, loading, error } = useGetOverridesQuery()
  console.log(data)

  if (loading) return null

  // TODO: Remove Mock Data
  // const data = {
  //   courseNo: '0123101',
  //   genEd: {
  //     genEdType: 'HU',
  //   },
  //   credit: '3 (3-0-6)',
  //   courseName: 'Paragraph Writing',
  // }

  return (
    <div>
      {data.overrides.map((data: Override) => {
        return (
          <>
            <GenEdTableBody>
              <Typography sx={{ fontWeight: 700 }}>{data.genEd.genEdType}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{data.courseNo}</Typography>
              <Typography sx={{ fontWeight: 700, justifySelf: 'start' }}>
                {data.courseNo}
              </Typography>
              <Typography></Typography>
              <GenEdCreditContainer>
                <Typography sx={{ fontWeight: 700, justifySelf: 'center' }}>
                  {data.courseNo}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}></Typography>
                <DeleteOutlinedIcon sx={{ fontSize: 24 }} />
              </GenEdCreditContainer>
            </GenEdTableBody>
          </>
        )
      })}
    </div>
  )
}
