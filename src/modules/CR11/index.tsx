import { Typography, Stack, Link } from '@mui/material'
import { observer } from 'mobx-react'

import { useTranslation } from 'react-i18next'

import { BackButton } from '@/common/components/BackButton'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { PageMeta } from '@/components/PageMeta'
import { CR11 } from '@/modules/CR11/components/CR11'
import { courseCartStore } from '@/store/courseCart'

export const CR11Page = observer(() => {
  const shoppingCart = courseCartStore
  const { t } = useTranslation(['program', 'cr11'])
  const courseGroup = useCourseGroup()
  const { academicYear: year, semester } = courseGroup
  const studyProgramText = `${t('cr11:semester')} ${year}/${semester} ${t(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    `program:${courseGroup.studyProgram || 's'}` as any
  )}`
  const { buildLink } = useLinkBuilder()

  return (
    <Stack marginTop={4} marginBottom={{ xs: 10, sm: 12 }}>
      <PageMeta title={t('cr11:enrollingSubject')} />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <BackButton href={buildLink(`/schedule`)} />
        <Typography variant="subtitle1" fontWeight={500} display={{ sm: 'none' }}>
          {studyProgramText}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop={3}
        marginBottom={{ xs: 4, sm: 6 }}
      >
        <div>
          <Typography variant="h3">{t('cr11:enrollingSubject')}</Typography>
          <Typography variant="subtitle1" color="primaryRange.100" fontWeight={500} marginTop={{ xs: 3, sm: 0 }}>
            {t('cr11:simulateDocument')}
          </Typography>
        </div>
        <Typography variant="subtitle1" display={{ xs: 'none', sm: 'block' }} fontWeight={500}>
          {studyProgramText}
        </Typography>
      </Stack>
      <CR11 courses={shoppingCart.shopItemsByCourseGroup(courseGroup)} />
      <Stack spacing={2} marginTop={{ xs: 4, sm: 16 }}>
        <Typography variant="h3">
          {t('cr11:total')}
          <Typography component="span" variant="h3" color="secondaryRange.900">
            {t('cr11:not')}
          </Typography>
          {t('cr11:realRegistration')}
        </Typography>
        <Typography variant="h5" fontWeight={500}>
          {t('cr11:explanation')}
          <br />
          {t('cr11:explanation2')}
        </Typography>
        <Typography variant="h5" fontWeight={500}>
          <Link underline="always" href="https://www2.reg.chula.ac.th/">
            https://www2.reg.chula.ac.th/
          </Link>
        </Typography>
      </Stack>
    </Stack>
  )
})
