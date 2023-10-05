import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './components/App'

const theme = createTheme()

const root = document.getElementById('root')
const rootContainer = createRoot(root)
rootContainer.render(<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>)
