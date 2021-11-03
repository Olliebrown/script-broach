import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Container, Typography, Grid } from '@material-ui/core'

import Dictaphone from './Components/Dictaphone.jsx'

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid lightgrey'
  }
}))

export default function App () {
  const { pageHeader } = useStyles()

  return (
    <Container fixed>
      <Typography variant="h2" component="h1" className={pageHeader}>
        {'WebSpeech API in React'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Dictaphone />
        </Grid>
      </Grid>
    </Container>
  )
}
