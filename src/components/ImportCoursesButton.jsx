import React from 'react'
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import CloudUpload from '@mui/icons-material/CloudUpload'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ImportCoursesButton = ({ onImport }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (file) {
      try {
        const content = await readFileAsync(file)
        const parsedJson = JSON.parse(content)

        // Assuming onImport is a Redux action creator
        onImport(parsedJson)
      } catch (error) {
        console.error('Error reading or parsing the file:', error)
      }
    }
  }

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        resolve(event.target.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsText(file)
    })
  }

  return (
    <div>
      {/* <Button variant="contained" component="label">
        <Input
          type="file"
          hidden
          inputProps={{ accept: '.json' }}
          onChange={handleFileChange}
        />
      </Button> */}
      <Button component="label" variant="contained" startIcon={<CloudUpload />}>
        Upload file
        <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
    </Button>
    </div>
  )
}

export default ImportCoursesButton
