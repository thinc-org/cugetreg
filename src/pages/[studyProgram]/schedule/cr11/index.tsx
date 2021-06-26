import { courseCartStore } from '@/store/shoppingCart'
import { Typography, makeStyles } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { CR11 } from '@/components/CR11'
import { useTranslation } from 'react-i18next'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import { mockCourseData } from '@/__mock__/courses'
import { BackButton } from '@/components/BackButton'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonMobile: {
    border: '1px solid #2A2D48',
    boxSizing: 'border-box',
    borderRadius: '4px',
    textAlign: 'right',
    padding: '5px 8px',
    color: theme.palette.primaryRange[400],
  },
  semester: {
    fontWeight: 500,
  },
  main: {
    lineHeight: theme.spacing(4),
  },
  subtitle: {
    color: theme.palette.primaryRange['100'],
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
    },
  },
  desktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobile: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(3, 0, 6, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(3, 0, 4, 0),
    },
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    '& *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  not: {
    color: theme.palette.secondaryRange[900],
  },
  explanation: {
    fontWeight: 500,
  },
  website: {
    fontWeight: 500,
    textDecoration: 'underline',
    '& a': {
      color: theme.palette.primaryRange[500],
    },
  },
}))

const Home = observer(() => {
  const shoppingCart = courseCartStore
  const classes = useStyles()
  const { t } = useTranslation(['program', 'cr11'])
  const { studyProgram, academicYear: year, semester } = useCourseGroup()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studyProgramText = `${t('cr11:semester')} ${year}/${semester} ${t(`program:${studyProgram || 's'}` as any)}`

  useEffect(() => {
    // get mock data
    const getMockCourse = (i: number) => {
      return mockCourseData[i]
    }
    for (let i = 0; i < 4; i++) {
      const mockCourse = getMockCourse(i)
      shoppingCart.addItem(mockCourse, mockCourse.sections[0].sectionNo)
    }
  }, [shoppingCart])

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <BackButton />
        <Typography className={`${classes.semester} ${classes.mobile}`} variant="subtitle1">
          {studyProgramText}
        </Typography>
      </div>
      <div className={classes.title}>
        <div>
          <Typography className={classes.main} variant="h3">
            {t('cr11:enrollingSubject')}
          </Typography>
          <Typography className={classes.subtitle} variant="subtitle1">
            {t('cr11:simulateDocument')}
          </Typography>
        </div>
        <Typography className={`${classes.semester} ${classes.desktop}`} variant="subtitle1">
          {studyProgramText}
        </Typography>
      </div>
      <CR11 courses={shoppingCart.courses} />
      <div className={classes.description}>
        <Typography variant="h3">
          {t('cr11:total')}
          <span className={classes.not}>{t('cr11:not')}</span>
          {t('cr11:realRegistration')}
        </Typography>
        <Typography variant="h5" className={classes.explanation}>
          {t('cr11:explanation')}
          <br />
          {t('cr11:explanation2')}
        </Typography>
        <Typography variant="h5" className={classes.website}>
          <a href="https://www2.reg.chula.ac.th/">https://www2.reg.chula.ac.th/</a>
        </Typography>
      </div>
    </div>
  )
})

export default Home
