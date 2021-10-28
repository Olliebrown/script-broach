import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Container, Typography, Button, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid lightgrey'
  },
  dangerButton: {
    color: theme.status.danger
  }
}))

export default function App () {
  const { pageHeader, dangerButton } = useStyles()

  const [enablePower, setEnablePower] = useState(false)

  return (
    <Container fixed>
      <Typography variant="h2" component="h1" className={pageHeader}>
        {'Welcome to Material UI!'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button variant="contained" fullWidth color="primary">
            {'Hello Streetlight'}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" fullWidth color="secondary">
            {'What\'cha knowing?'}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={() => { setEnablePower(!enablePower) }} fullWidth className={dangerButton}>
            {'I\'ve come to see'}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth disabled={enablePower}>
            {'Your power flowin\''}
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
