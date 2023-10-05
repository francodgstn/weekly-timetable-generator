import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { Chip, Popover, TextField } from '@material-ui/core'
import { FormControl, InputLabel } from '@mui/material'

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
          id={'color'}
          label="Color"
          name="color"
          value={color}
          onChange={onChange}
          />
      </FormControl>
      <Chip onClick={handleClick}
            style={{ backgroundColor: color, width: '30px', height: '30px', marginTop: '15px' }}
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