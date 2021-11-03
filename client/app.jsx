import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Container, Typography, Grid } from '@material-ui/core'

import Speaker from './Components/Speaker.jsx'
import Dictaphone from './Components/Dictaphone.jsx'

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
  const { pageHeader } = useStyles()

  return (
    <Container fixed>
      <Typography variant="h2" component="h1" className={pageHeader}>
        {'Welcome to Material UI!'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Speaker />
        </Grid>

        <Grid item xs={12}>
          <Dictaphone />
        </Grid>
      </Grid>
    </Container>
  )
}
