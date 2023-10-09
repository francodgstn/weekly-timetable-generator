import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline'
import App from './components/App'
import {store} from './store'

const theme = createTheme()

const root = document.getElementById('root')
const rootContainer = createRoot(root)
rootContainer.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
    </StyledEngineProvider>
</Provider>)
