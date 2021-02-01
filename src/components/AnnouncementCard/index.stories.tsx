import React from 'react'
import AnnouncementCard, { AnnouncementCardPropTypes } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { date } from '@storybook/addon-knobs'
import { makeStyles, ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/AnnouncementCard',
} as Meta

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    padding: theme.spacing(1.25),
  },
}))

const AnnouncementCardStory: Story<AnnouncementCardPropTypes> = (args) => {
  const styles = useStyles()
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={styles.root}>
        <AnnouncementCard {...args} />
      </div>
    </ThemeProvider>
  )
}

AnnouncementCardStory.args = {
  date: new Date(date('date', new Date())),
  imageURL: 'https://foreignpolicy.com/wp-content/uploads/2020/07/Marine-Thailand-Exercise-GettyImages-1203838332.jpg',
  title: 'เปิดวิชาเรียนใหม่ 0201170 Military Science เสริมสร้างวินัยทหารในตัวคุณ',
  tags: ['เปิดวิชา1', 'เปิดวิชา2'],
  genEds: ['HU', 'HU'],
  body: 'เนื้อหาวิชา วิทยาการทหาร ยุทธศาสตร์ชาติ ประวัติศาสตร์การทหาร กองทัพบก กองทัพอากาศ กองทัพเรือ ...',
}
