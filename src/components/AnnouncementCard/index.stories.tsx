import React from 'react'
import AnnouncementCard from '.'
import { Meta } from '@storybook/react/types-6-0'
import { array, text, withKnobs } from '@storybook/addon-knobs'
import { date } from '@storybook/addon-knobs'
import { makeStyles, ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'
import { GenEd } from '@/utils/types'

export default {
  title: 'Component/AnnouncementCard',
  decorators: [withKnobs],
} as Meta

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    padding: theme.spacing(1.25),
  },
}))

export const AnnouncementCardStory = () => {
  const styles = useStyles()
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={styles.root}>
        <AnnouncementCard
          date={new Date(date('date', new Date()))}
          imageURL={text(
            'imageURL',
            'https://foreignpolicy.com/wp-content/uploads/2020/07/Marine-Thailand-Exercise-GettyImages-1203838332.jpg'
          )}
          title={text('title', 'เปิดวิชาเรียนใหม่ 0201170 Military Science เสริมสร้างวินัยทหารในตัวคุณ')}
          tags={array('tags', ['เปิดวิชา1', 'เปิดวิชา2'])}
          genEds={array('geneds', [GenEd.HU, GenEd.IN]) as GenEd[]}
          body={text(
            'body',
            'เนื้อหาวิชา วิทยาการทหาร ยุทธศาสตร์ชาติ ประวัติศาสตร์การทหาร กองทัพบก กองทัพอากาศ กองทัพเรือ ...'
          )}
        />
      </div>
    </ThemeProvider>
  )
}
