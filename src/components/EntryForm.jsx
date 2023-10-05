import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@material-ui/core'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock'

import ColorSelect from './ColorPicker'

const EntryForm = () => {
  const defaultTime = dayjs().set({ hour: 8, minute: 0 })

  const [formData, setFormData] = useState({
    name: '',
    color: '#CCCCCC',
    schedule: [{ dayOfWeek: '', timeFrom: defaultTime, timeTo: defaultTime, label: '' }]
  })

  const handleInputChange = (index, field, value) => {
    if (index === -1) {
      setFormData({
        ...formData,
        [field]: value
      })
      return
    }
    const newSchedule = [...formData.schedule]
    newSchedule[index][field] = value
    setFormData({
      ...formData,
      schedule: newSchedule
    })
  }

  const handleAddClass = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { dayOfWeek: '', timeFrom: defaultTime, timeTo: defaultTime, label: '' }]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a new course object
    const newCourse = {
      name: formData.name,
      color: formData.color,
      schedule: formData.schedule.map((courseClass) => ({
        dayOfWeek: courseClass.dayOfWeek,
        timeFrom: courseClass.timeFrom.format('HH:mm'),
        timeTo: courseClass.timeTo.format('HH:mm'),
        label: courseClass.label
      }))
    }

    // Retrieve existing courses from local storage
    const existingCourses = JSON.parse(localStorage.getItem('courses')) || []

    // Add the new course to the array
    existingCourses.push(newCourse)

    // Save the updated array back to local storage
    localStorage.setItem('courses', JSON.stringify(existingCourses))

    // Optionally, you can reset the form data
    setFormData({
      name: '',
      color: '#CCCCCC',
      schedule: [{ dayOfWeek: '', timeFrom: defaultTime, timeTo: defaultTime, label: '' }]
    })

    // Optionally, you can trigger a re-render or any other logic
  }

  const shouldDisableTime = (value, view) => {
    const hour = value.hour()
    if (view === 'hours') {
      return hour < 8 || hour > 20
    }
    // if (view === 'minutes') {
    //   const minute = value.minute()
    //   return minute > 20 && hour === 13
    // }
    return false
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Add New Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid item xs={12} sm={12}>
            <TextField
              label="Name"
              fullWidth
              id={'name'}
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(-1, 'name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>

              <ColorSelect
                  color={formData.color}
                  onChange={(e) => handleInputChange(-1, 'color', e)}
                />

            </Grid>
        {formData.schedule.map((courseClass, index) => (
          <Grid container spacing={0} key={index} style={{ margin: '30px 0' }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
              {`Class ${index + 1}`}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Label"
                fullWidth

                name={`label-${index}`}
                value={courseClass.label}
                onChange={(e) => handleInputChange(index, 'label', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth >
                <InputLabel id={`dayOfWeek-label-${index}`}>Day Of Week</InputLabel>
                <Select
                  labelId={`dayOfWeek-label-${index}`}
                  id={`dayOfWeek-${index}`}
                  name={`dayOfWeek-${index}`}
                  value={courseClass.dayOfWeek}
                  onChange={(e) => handleInputChange(index, 'dayOfWeek', e.target.value)}
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>

              </FormControl>
            </Grid>

            <Grid item xs={6} sm={6}>
              <InputLabel id={`timeFrom-${index}`} style={{ marginTop: '20px', marginBottom: '5px' }}>From</InputLabel>
              <MultiSectionDigitalClock
                style={{ height: '150px' }}
                skipDisabled
                shouldDisableTime={shouldDisableTime}
                timeSteps={{ hours: 1, minutes: 15 }}
                ampm={false}
                value={courseClass.timeFrom}
                onChange={(newValue) => handleInputChange(index, 'timeFrom', newValue)}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <InputLabel id={`timeTo-${index}`} style={{ marginTop: '20px', marginBottom: '5px' }}>To</InputLabel>
              <MultiSectionDigitalClock
                style={{ height: '150px' }}
                skipDisabled
                shouldDisableTime={shouldDisableTime}
                timeSteps={{ hours: 1, minutes: 15 }}
                ampm={false}
                value={courseClass.timeTo}
                onChange={(newValue) => handleInputChange(index, 'timeTo', newValue)}
              />
            </Grid>

          </Grid>
        ))}

        <Button type="button" variant="contained" color="secondary" onClick={handleAddClass}>
          Add Another Class
        </Button>

        {/* Add more form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Add Course
        </Button>

      </form>
    </Paper>
    </LocalizationProvider>
  )
}

export default EntryForm
