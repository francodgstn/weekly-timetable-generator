import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { Chip, Popover, TextField, FormControl } from '@mui/material'

// eslint-disable-next-line react/prop-types
const ColorPicker = ({ color, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (selectedColor) => {
    onChange(selectedColor.hex)
  }

  return (
    <div>
      <FormControl>
      {/* <InputLabel id={'color-label'}>Color</InputLabel> */}
      <TextField
          size="small"
          id='color'
          label="Color"
          name="color"
          value={color}
          onChange={onChange}
          />
      </FormControl>
      <Chip onClick={handleClick}
            sx={{backgroundColor: color, width:'30px', height:'30px', mt: '5px', ml:-5 }}
            label=""
            />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <SketchPicker color={color} onChange={handleChange} />
      </Popover>
      </div>
  )
}

export default ColorPicker
