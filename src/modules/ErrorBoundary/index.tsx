import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'

import { collectErrorLog, sessionId } from '@/services/logging'
import { gapiStore } from '@/store/googleApiStore'

export class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: any, info: any) {
    collectErrorLog('React error boundary', error)
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Grid padding="5%">
          <Typography variant="h1">Something went wrong.</Typography>

          <Typography variant="h3">
            <p>Please contact the development team (upper right button)</p>
            <p>Session ID: {sessionId}</p>
            <p>UID: {gapiStore.currentUser?.getId()}</p>
          </Typography>
        </Grid>
      )
    }
    return this.props.children
  }
}
