import { useMe } from '@/utils/network/auth'
import { Card, CircularProgress, Grid } from '@material-ui/core'

function MePage() {
  const me = useMe()

  let p = null
  if (me.loading) p = <CircularProgress />
  if (me.error) p = me.error.message
  if (me.data)
    p = (
      <>
        ID: {me.data._id}
        <br />
        Email: {me.data.email}
        <br />
        Name: {me.data.firstName} {me.data.lastName}
        <br />
        GToken: {me.data.google.accessToken} {me.data.google.expiresIn}
      </>
    )

  return <Grid margin="5%">{p}</Grid>
}

export default MePage
