// Speech-recognition needs this
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import { RecoilRoot } from 'recoil'

import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'
import { CssBaseline } from '@material-ui/core'

import App from './App.jsx'

const theme = createTheme({
  status: {
    danger: orange[500]
  }
})

ReactDOM.render(
  <RecoilRoot>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById('root')
)
