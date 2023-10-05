import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './components/App'
import {store} from './store'

const theme = createTheme()

const root = document.getElementById('root')
const rootContainer = createRoot(root)
rootContainer.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
</Provider>)
