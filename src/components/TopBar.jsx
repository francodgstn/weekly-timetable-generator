import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

const TopBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Weekly Timetable Generator</Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
