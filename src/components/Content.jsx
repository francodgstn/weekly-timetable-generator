import React, { useState } from 'react'
import { Container, Grid, Tabs, Tab, Paper } from '@mui/material'
import Timetable from './Timetable' // Create Timetable.jsx for rendering the timetable
import EntryForm from './EntryForm' // Create EntryForm.jsx for the form
import CoursesList from './CoursesList'


const Content = () => {


  const [tabValue, setTabValue] = useState(0)

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Left Column - Form */}
        <Grid item xs={12} sm={12}>
          <EntryForm />
        </Grid>

        {/* Right Column - Timetable */}
        <Grid xs={12} sm={12} item container >
          <Grid item xs={12} sm={12}>
            <Tabs value={tabValue} onChange={handleChangeTab}>
              <Tab label="Timetable" />
              <Tab label="Courses" />
              <Tab label="Classes" />
            </Tabs>
          </Grid>
          <Grid item xs={12} sm={12} alignItems="flex-start">
            {tabValue === 0 && <Timetable />}
            {tabValue === 1 && <CoursesList />}
            {tabValue === 2 && <Paper>test</Paper>}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Content
