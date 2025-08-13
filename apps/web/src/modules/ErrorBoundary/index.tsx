import React from 'react'

import { Grid, Typography } from '@mui/material'

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: unknown) {
    console.error('React error boundary', error)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Grid padding="5%">
          <Typography variant="h1">Something went wrong.</Typography>

          <Typography variant="h3">
            <p>Please contact the development team (upper right button)</p>
          </Typography>
        </Grid>
      )
    }
    return this.props.children
  }
}
