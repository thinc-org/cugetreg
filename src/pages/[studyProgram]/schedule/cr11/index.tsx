import { mockData } from '@/components/ShoppingPanel/mockData'
import { courseCartStore } from '@/store/shoppingCart'
import { Button, Typography, IconButton, makeStyles } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { CR11 } from '@/components/CR11'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const useStyles = makeStyles((theme) => ({
  buttonMobile: {
    border: '1px solid #2A2D48',
    boxSizing: 'border-box',
    borderRadius: '4px',
    textAlign: 'right',
    padding: '5px 8px',
    color: theme.palette.primaryRange[400],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
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
    color: theme.palette.secondaryRange[500],
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
  warning: {
    textDecoration: 'underline',
  },
}))

const Home = observer(() => {
  const shoppingCart = courseCartStore
  const classes = useStyles()

  useEffect(() => {
    // get mock data
    const getMockCourse = (i: number) => {
      return mockData[i]
    }
    for (let i = 0; i < 4; i++) {
      const mockCourse = getMockCourse(i)
      shoppingCart.addItem(mockCourse, mockCourse.sections[0].sectionNo)
    }
  }, [shoppingCart])

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Button
          className={classes.desktop}
          startIcon={<ArrowBackIosIcon />}
          color="primary"
          variant="outlined"
          disableElevation
        >
          กลับ
        </Button>
        <IconButton className={`${classes.buttonMobile} ${classes.mobile}`} aria-label="back">
          <ArrowBackIosIcon />
        </IconButton>
        <Typography className={`${classes.semester} ${classes.mobile}`} variant="subtitle1">
          ปีการศึกษา 2563/2 หลักสูตรนานาชาติ
        </Typography>
      </div>
      <div className={classes.title}>
        <div>
          <Typography className={classes.main} variant="h3">
            รายวิชาที่ต้องการลงทะเบียนเรียน
          </Typography>
          <Typography className={classes.subtitle} variant="subtitle1">
            จำลองเอกสาร แสดงความจำนงขอลงทะเบียนเรียน (จท11)
          </Typography>
        </div>
        <Typography className={`${classes.semester} ${classes.desktop}`} variant="subtitle1">
          ปีการศึกษา 2563/2 หลักสูตรนานาชาติ
        </Typography>
      </div>
      <CR11 courses={shoppingCart.courses} />
      <div className={classes.description}>
        <Typography className={classes.warning} variant="h3">
          ทั้งหมดนี้<span className={classes.not}>ไม่ใช่</span>การลงทะเบียนเรียนจริง
        </Typography>
        <Typography variant="h5" className={classes.explanation}>
          CU Get Reg เป็นเพียงแอปพลิเคชันที่ใช้อำนวยความสะดวกในการจัดตารางสอนเท่านั้น
          <br />
          คุณสามารถลงทะเบียนเรียนได้ที่{' '}
        </Typography>
        <Typography variant="h5" className={classes.website}>
          <a href="https://www2.reg.chula.ac.th/">https://www2.reg.chula.ac.th/</a>
        </Typography>
      </div>
    </div>
  )
})

export default Home
