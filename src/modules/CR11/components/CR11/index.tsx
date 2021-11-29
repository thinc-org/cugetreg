import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CourseCartItem } from '@/store/courseCart'

import { Column, ColumnHeader } from './styled'
import { toNumberString } from './utils'

interface CR11Props {
  courses?: CourseCartItem[]
}

export function CR11({ courses }: CR11Props) {
  const filteredCourses = courses?.filter((course) => !course.isHidden)
  const totalCredit = filteredCourses?.reduce((accumulator, course) => accumulator + course.credit, 0)
  const { t } = useTranslation('cr11')

  const Items = filteredCourses?.map((course, i) => {
    return (
      <TableRow key={course.courseNo}>
        <Column variant="body1">{i + 1}</Column>
        <Column variant="body1">{course.courseNo}</Column>
        <Column variant="body1" textAlign="left">
          {course.abbrName}
        </Column>
        <Column variant="body1">
          {course.selectedSectionNo} {t('only')}
        </Column>
        <Column variant="body1">{toNumberString(course.credit)}</Column>
      </TableRow>
    )
  })

  return (
    <Table
      sx={{
        'td, th': {
          border: 0,
          textAlign: 'center',
        },
        th: {
          px: { xs: 0.5, sm: 4 },
          py: { xs: 1, sm: 1 },
        },
        td: {
          px: { xs: 0.5, sm: 4 },
          py: 0.5,
        },
        'td:nth-of-type(1), th:nth-of-type(1)': {
          display: { xs: 'none', sm: 'table-cell' },
        },
        'tr:nth-of-type(1) td': {
          pt: { xs: 0.5, sm: 2 },
        },
      }}
    >
      <TableHead>
        <TableRow sx={{ bgcolor: 'primaryRange.30', mb: 2 }}>
          <ColumnHeader variant="h6">{t('order')}</ColumnHeader>
          <TableCell>
            <Typography variant="h6" component="span" display={{ xs: 'none', sm: 'inline-block' }}>
              {t('courseNo')}
            </Typography>
            <Typography variant="h6" component="span" display={{ sm: 'none' }}>
              {t('courseNoMobile')}
            </Typography>
          </TableCell>
          <ColumnHeader variant="h6">{t('abbrName')}</ColumnHeader>
          <ColumnHeader variant="h6">{t('section')}</ColumnHeader>
          <TableCell>
            <Typography variant="h6" component="span" display={{ xs: 'none', sm: 'inline-block' }}>
              {t('credit')}
            </Typography>
            <Typography variant="h6" component="span" display={{ sm: 'none' }}>
              {t('creditMobile')}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Items}
        <TableRow>
          <td></td>
          <td></td>
          <td></td>
          <Column variant="h6" pt={3}>
            {t('totalCredit')}
          </Column>
          <Column variant="h6" pt={3}>
            {toNumberString(totalCredit)}
          </Column>
        </TableRow>
      </TableBody>
    </Table>
  )
}
