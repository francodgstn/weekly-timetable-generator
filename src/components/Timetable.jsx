import React from 'react'
import { styled } from '@mui/material/styles'
import { Paper, Typography, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, IconButton } from '@mui/material'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import { PictureAsPdf, CropOriginal, FileDownload } from '@mui/icons-material' // Import the icons
import { useSelector } from 'react-redux'

const PREFIX = 'Timetable'

const classes = {
  timeTableTable: `${PREFIX}-timeTableTable`,
  cell: `${PREFIX}-cell`,
  headerDay: `${PREFIX}-headerDay`,
  headerTime: `${PREFIX}-headerTime`,
  oClockRow: `${PREFIX}-oClockRow`,
  oClockCell: `${PREFIX}-oClockCell`,
  cellOfClass: `${PREFIX}-cellOfClass`,
  cellOfTime: `${PREFIX}-cellOfTime`,
  timeLabel: `${PREFIX}-timeLabel`,
  cellOfTimeOClock: `${PREFIX}-cellOfTimeOClock`,
  classInfo: `${PREFIX}-classInfo`,
  classInfoCourse: `${PREFIX}-classInfoCourse`
}

const StyledPaper = styled(Paper)({
  [`& .${classes.timetableTable}`]: {
    borderCollapse: 'collapse'
  },
  [`& .${classes.cell}`]: {
    padding: '0px 3px', // Adjust the padding as needed
    fontSize: '10px', // Set the desired font size
    position: 'relative', // Position relative for absolute positioning of class info
    border: 'none',
    borderLeft: '1px solid #ccc',
    verticalAlign: 'top',
    height: '15px'
  },
  [`& .${classes.headerDay}`]: {
    padding: '10px 5px',
    textAlign: 'center',
    fontSize: '15px',
    width: 'calc(95% / 7)', // Equal width for each of the 7 days + time
    textTransform: 'uppercase'
  },
  [`& .${classes.headerTime}`]: {
    padding: '10px 10px 5px 5px',
    width: '5%',
    textAlign: 'right',
    borderLeft: 'none'
  },
  [`& .${classes.oClockRow}`]: {

  },
  [`& .${classes.oClockCell}`]: {
    fontWeight: 'bold',
    borderTop: '1px solid #ccc'
  },
  [`& .${classes.cellOfClass}`]: {
    // borderRadius: '4px',
    border: '2px solid #000',
    overflow: 'hidden'
  },
  [`& .${classes.cellOfTime}`]: {
    borderLeft: 'none',
    textAlign: 'right',
    paddingRight: '10px',
    position: 'relative'
  },
  [`& .${classes.timeLabel}`]: {
    marginTop: '-5px'
  },
  [`& .${classes.cellOfTimeOClock}`]: {
    borderTop: 'none'
  },
  [`& .${classes.classInfo}`]: {
    padding: '5px 2px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    pointerEvents: 'none' // Prevent class info from blocking interactions with cells
  },
  [`& .${classes.classInfoCourse}`]: {
    fontSize: '12px',
    fontWeight: 'bold'
  }
})

const Timetable = () => {
  const courses = useSelector((state) => state.courses)

  const generateTimeSlots = () => {
    const timeSlots = []
    const startTime = new Date()
    startTime.setHours(8, 0, 0) // Start at 8:00 AM

    for (let i = 0; i < 56; i++) {
      const time = new Date(startTime.getTime() + i * 15 * 60 * 1000)
      // const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const formattedTime = time.toLocaleTimeString('it-ch', { hour: '2-digit', minute: '2-digit' })
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
          timeFrom,
          timeTo,
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
        html2canvas: { scale: 1 },
        jsPDF: { format: 'a4', orientation: 'portrait' }
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

    const scale = 4 // Adjust the scale factor as needed

    html2canvas(container, { scale, quality: 0.98 }).then((canvas) => {
      const pngData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = pngData
      link.download = 'timetable.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const exportTimetableAsJson = () => {
    const container = document.getElementById('timetable-container')

    if (!container) {
      console.error('Container not found')
      return
    }

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(courses)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  }

  return (
    <StyledPaper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Timetable
      </Typography>
      <Toolbar className={classes.toolbar}>
        <Tooltip title="Export as JSON">
          <IconButton onClick={exportTimetableAsJson} color="primary" size="large">
            <FileDownload />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Export as PNG">
          <IconButton onClick={exportTimetableAsPng} color="primary" size="large">
            <CropOriginal />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export as PDF">
          <IconButton onClick={exportAsPdf} color="primary" size="large">
            <PictureAsPdf />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <TableContainer id="timetable-container">
        <Table className={classes.timeTableTable}>
          <TableHead>
            <TableRow>
              <TableCell className={`${classes.cell} ${classes.headerTime}`}>Time</TableCell>
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
                  <TableCell className={`${classes.cell} ${classes.cellOfTime} ${row.isOClock ? classes.cellOfTimeOClock : ''}`}>
                    <div className={classes.timeLabel}>{row.isOClock ? row.time : '\u00A0'}</div>
                  </TableCell>
                  {daysOfWeek.map((day, colIndex) => {
                    const classInfo = row.classInfo.find((info) => info.dayOfWeek === day)

                    if (!classInfo) { return (<TableCell key={day} className={`${classes.cell} ${row.isOClock ? classes.oClockCell : ''}`}>&nbsp;</TableCell>) }

                    if (classInfo.isStartOfClass) {
                      return (<TableCell
                        key={day}
                        rowSpan={classInfo.isStartOfClass ? classInfo.length : 1}
                        className={`${classes.cell} ${classes.cellOfClass}`}
                        style={{
                          // border: classInfo.isStartOfClass ? 'none' : null,
                          backgroundColor: classInfo.color || '#CCCCCC'
                        }}
                      >
                        <div className={classes.classInfo}>
                          <div>{classInfo.timeFrom} - {classInfo.timeTo}</div>
                          <div className={classes.classInfoCourse}>{classInfo.course}</div>
                          <div><strong>{classInfo.label}</strong></div>
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
    </StyledPaper>
  )
}

export default Timetable
