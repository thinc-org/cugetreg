import { AnnouncementCard } from '@/components/AnnouncementCard'
import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles({
  root: {
    background: '#000000',
  },
})

const Demo = () => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <AnnouncementCard
        date={new Date()}
        imageURL="https://libreshot.com/wp-content/uploads/2018/10/thermo-camera.jpg"
        title="test"
        tags={['test1', 'test2']}
        body="lorem yipsum"
      />
      This is DEMO page for demonstrating components bofore having storybook
    </div>
  )
}

export default Demo
