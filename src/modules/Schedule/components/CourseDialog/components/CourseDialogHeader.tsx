import { ChevronRight } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import { COURSE_DIALOG_CHEVRON } from '@/common/context/Analytics/constants'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { useCourseDialog } from '@/modules/Schedule/components/CourseDialog/context'

export function CourseDialogHeader() {
  const { item } = useCourseDialog()
  const { t } = useTranslation('courseDialog')
  const { courseNo, abbrName, credit: credits, courseNameTh, courseNameEn } = item
  const { buildLink } = useLinkBuilder()
  return (
    <Stack spacing={[0.5, 1]}>
      <Stack justifyContent="space-between" direction="row" flex={1} alignItems="flex-start">
        <Stack flexWrap="wrap" direction="row" alignItems="center" columnGap={2}>
          <Typography variant="h4">
            {courseNo} {abbrName}
          </Typography>
          <Typography variant="h6" color="primaryRange.100">
            {t('credits', { credits })}
          </Typography>
        </Stack>

        <LinkWithAnalytics
          href={buildLink(`/courses/${courseNo}`)}
          passHref
          elementName={COURSE_DIALOG_CHEVRON}
          elementId={courseNo}
        >
          <IconButton aria-label="delete" size="large" sx={{ color: 'primary.500' }}>
            <ChevronRight fontSize="inherit" />
          </IconButton>
        </LinkWithAnalytics>
      </Stack>
      <Stack>
        <Typography variant="h6">{courseNameTh}</Typography>
        <Typography variant="h6">{courseNameEn}</Typography>
      </Stack>
    </Stack>
  )
}
