import React, { useState, useEffect } from 'react'
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, IconButton, makeStyles } from '@material-ui/core'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import { Refresh, PictureAsPdf, CropOriginal } from '@material-ui/icons' // Import the icons
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  cell: {
    padding: '2px', // Adjust the padding as needed
    fontSize: '10px', // Set the desired font size
    position: 'relative' // Position relative for absolute positioning of class info
  },
  headerDay: {
    // textAlign: 'center',
    width: 'calc(100% / 8)' // Equal width for each of the 7 days + time
  },
  oClockRow: {
    borderTop: '1px solid #000' // Add a solid border to the top of "o'clock" rows
  },
  oClockCell: {
    fontWeight: 'bold'
  },
  cellOfClass: {
    borderRadius: '4px'
  },
  classInfo: {
    position: 'absolute',
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Center the element
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' // Prevent class info from blocking interactions with cells
  }
})

const Timetable = () => {
  const classes = useStyles()
  const courses = useSelector((state) => state.courses);

  //const [courses, setCourses] = useState(getCoursesFromStorage())

  // useEffect(() => {
  //   const updateFromStorage = (event) => {
  //     if (event.key === 'courses') {
  //       // Handle the change in storage and update the component state
  //       const storedCourses = getCoursesFromStorage()
  //       setCourses(storedCourses)
  //     }
  //   }

  //   window.addEventListener('storage', updateFromStorage)

  //   return () => {
  //     // window.removeEventListener('storage', updateFromStorage)
  //   }
  // }, [])

  // Function to get time slots from storage
  function getCoursesFromStorage () {
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    return storedCourses
  }

  const refreshFromStorage = () => {
    const storedCourses = getCoursesFromStorage()
    setCourses(storedCourses)
  }

  const generateTimeSlots = () => {
    const timeSlots = []
    const startTime = new Date()
    startTime.setHours(8, 0, 0) // Start at 8:00 AM

    for (let i = 0; i < 56; i++) {
      const time = new Date(startTime.getTime() + i * 15 * 60 * 1000)
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      timeSlots.push({ time: formattedTime, isOClock: time.getMinutes() === 0, classInfo: [] })
    }

    return timeSlots
  }

  const timeSlots = generateTimeSlots()

  courses && courses.forEach((course) => {
    course.schedule.forEach(({ dayOfWeek, timeFrom, timeTo, label }) => {
      const startHour = parseInt(timeFrom.split(':')[0])
      const startMinute = parseInt(timeFrom.split(':')[1])
      const startIndex = (startHour - 8) * 4 + startMinute / 15

      const endHour = parseInt(timeTo.split(':')[0])
      const endMinute = parseInt(timeTo.split(':')[1])
      const endIndex = (endHour - 8) * 4 + endMinute / 15

      const classLength = endIndex - startIndex

      for (let i = Math.max(0, startIndex); i < Math.min(timeSlots.length, startIndex + classLength); i++) {
        const isStartOfClass = i === startIndex
        timeSlots[i].classInfo.push({
          course: course.name,
          dayOfWeek,
          label,
          color: course.color,
          length: classLength,
          isStartOfClass
        })
      }
    })
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const exportAsPdf = () => {
    // Get the timetable container element by its ID or another selector
    const timetableContainer = document.getElementById('timetable-container')

    // Check if the container element is found
    if (timetableContainer) {
      // Define the PDF options (you can customize these as needed)
      const pdfOptions = {
        margin: 10,
        filename: 'timetable.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      // Use html2pdf to generate the PDF
      html2pdf().from(timetableContainer).set(pdfOptions).save()
    }
  }

  const exportTimetableAsPng = () => {
    const container = document.getElementById('timetable-container')

    if (!container) {
      console.error('Container not found')
      return
    }

    const scale = 1 // Adjust the scale factor as needed

    html2canvas(container, { scale }).then((canvas) => {
      const pngData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = pngData
      link.download = 'timetable.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Timetable
      </Typography>
      <Toolbar className={classes.toolbar}>
        <IconButton onClick={refreshFromStorage} color="primary">
          <Refresh />
        </IconButton>
        <IconButton onClick={exportAsPdf} color="primary">
          <PictureAsPdf />
        </IconButton>
        <IconButton onClick={exportTimetableAsPng} color="primary">
          <CropOriginal />
        </IconButton>
      </Toolbar>
      <TableContainer id="timetable-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Time</TableCell>
              {daysOfWeek.map((day) => (
                <TableCell key={day} className={`${classes.cell} ${classes.headerDay}`}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((row, rowIndex) => (
              <React.Fragment key={row.time}>
                <TableRow className={row.isOClock ? classes.oClockRow : ''}>
                  <TableCell className={`${classes.cell} ${row.isOClock ? classes.oClockCell : ''}`}>
                    {row.isOClock ? row.time : ' - '}
                  </TableCell>
                  {daysOfWeek.map((day, colIndex) => {
                    const classInfo = row.classInfo.find((info) => info.dayOfWeek === day)

                    if (!classInfo) { return (<TableCell key={day} className={classes.cell}></TableCell>) }

                    if (classInfo.isStartOfClass) {
                      return (<TableCell
                          key={day}
                          rowSpan={classInfo.isStartOfClass ? classInfo.length : 1}
                          className={`${classes.cell} ${classes.cellOfClass}`}
                          style={{
                            border: classInfo.isStartOfClass ? 'none' : null,
                            backgroundColor: classInfo.color || '#CCCCCC'
                          }}
                        >
                          <div className={classes.classInfo}>
                            <span>{classInfo.course}</span>
                          </div>
                        </TableCell>)
                    }

                    return ''
                  })
                  }
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default Timetable
