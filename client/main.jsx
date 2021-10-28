import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'
import { CssBaseline } from '@material-ui/core'

import App from './app.jsx'

const theme = createTheme({
  status: {
    danger: orange[500]
  }
})

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
)
