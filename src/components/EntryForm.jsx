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
  Grid,
  Divider,
  Stack,
  Chip
} from '@mui/material'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock'
import { useDispatch } from 'react-redux'
import ColorSelect from './ColorPicker'
import { coursesImported, courseAdded, courseDeletedAll } from './coursesSlice'
import ImportCoursesButton from './ImportCoursesButton'

const EntryForm = () => {
  const defaultTime = dayjs().set({ hour: 8, minute: 0 })
  const dispatch = useDispatch()
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

    dispatch(courseAdded(newCourse))
  }

  const handleImport = (value) => {
    dispatch(coursesImported(value))
  }

  const shouldDisableTime = (value, view) => {
    const hour = value.hour()
    if (view === 'hours') {
      return hour < 8 || hour > 21
    }
    // if (view === 'minutes') {
    //   const minute = value.minute()
    //   return minute > 20 && hour === 13
    // }
    return false
  }

  const clearTimetable = () => {
    dispatch(courseDeletedAll())
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack spacing={2}  direction={{ xs: 'column', sm: 'row' }}>
              <ImportCoursesButton
                onImport={handleImport} />
              <Button  variant="contained" color="primary" onClick={clearTimetable}>
                Clear Timetable
              </Button>
              
            </Stack>
          </Grid>

          <Grid container item xs={12}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                Add New Course
              </Typography>
            </Grid>
            <Grid item container xs={12} direction={'row'}>
              <Grid item xs={12} sm={4}>
                <TextField
                  size="small"
                  label="Name"
                  id={'name'}
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(-1, 'name', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <ColorSelect
                  color={formData.color}
                  onChange={(e) => handleInputChange(-1, 'color', e)}
                />

              </Grid>
            </Grid>

            {formData.schedule.map((courseClass, index) => (
              <Grid item container direction={'row'}>
                
                <Grid item xs={12}>
                  <Divider textAlign="left" sx={{mb:2,mt:2}}> <Chip size="small" label={`Class ${index+1}`} /></Divider>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    size="small"
                    label="Label"
                    name={`label-${index}`}
                    value={courseClass.label}
                    onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl sx={{ minWidth: 210 }}>
                    <InputLabel size="small" id={`dayOfWeek-label-${index}`}>Day Of Week</InputLabel>
                    <Select
                      size="small"
                      labelId={`dayOfWeek-label-${index}`}
                      id={`dayOfWeek-${index}`}
                      name={`dayOfWeek-${index}`}
                      value={courseClass.dayOfWeek}
                      label="Day Of Week"
                      autoWidth
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

                <Grid item xs={6} sm={2}>
                
                  <InputLabel shrink={true} id={`timeFrom-${index}`} >From</InputLabel>
                  <MultiSectionDigitalClock
                    labelId={`timeFrom-${index}`}
                    style={{ height: '105px' }}
                    skipDisabled
                    shouldDisableTime={shouldDisableTime}
                    timeSteps={{ hours: 1, minutes: 15 }}
                    ampm={false}
                    value={courseClass.timeFrom}
                    onChange={(newValue) => handleInputChange(index, 'timeFrom', newValue)}
                  />
                
                </Grid>

                <Grid item xs={6} sm={2}>
                  <InputLabel shrink={true} id={`timeTo-${index}`} >To</InputLabel>
                  <MultiSectionDigitalClock
                    style={{ height: '105px' }}
                    skipDisabled
                    shouldDisableTime={shouldDisableTime}
                    timeSteps={{ hours: 1, minutes: 15 }}
                    ampm={false}
                    value={courseClass.timeTo}
                    onChange={(newValue) => handleInputChange(index, 'timeTo', newValue)}
                  />
                </Grid>
                
                
                  
              </Grid>))
            }

          </Grid>

        </Grid>

        <Stack spacing={2}  direction={{ xs: 'column', sm: 'row' }}>
            
          <Button type="button" variant="contained" color="secondary" onClick={handleAddClass}>
            Add Another Class
          </Button>

          {/* Add more form fields as needed */}
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            Add Course
          </Button>

        </Stack>
      </Paper>
    </LocalizationProvider>
  )
}

export default EntryForm
