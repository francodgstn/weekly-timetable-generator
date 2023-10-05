import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@material-ui/core'

const CoursesList = () => {
  const [courses, setCourses] = useState(getCoursesFromStorage())

  useEffect(() => {
    const updateFromStorage = (event) => {
      if (event.key === 'courses') {
        // Handle the change in storage and update the component state
        const storedCourses = getCoursesFromStorage()
        setCourses(storedCourses)
      }
    }

    window.addEventListener('storage', updateFromStorage)

    return () => {
      // window.removeEventListener('storage', updateFromStorage)
    }
  }, [])

  // Function to get time slots from storage
  function getCoursesFromStorage () {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    return storedCourses
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Courses
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Classes Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell> <Chip
                    style={{ backgroundColor: course.color, width: '20px', height: '20px' }}
                    label=""
                    /> {course.name}</TableCell>
                <TableCell>{course.schedule.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CoursesList
