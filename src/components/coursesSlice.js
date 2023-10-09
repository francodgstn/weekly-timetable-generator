import { createSlice } from '@reduxjs/toolkit'

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    coursesImported (state, action) {
      return action.payload
    },
    courseAdded (state, action) {
      state.push(action.payload)
    },
    courseDeletedAll (state, action) {
      return []
    }
  }
})

export const { coursesImported, courseAdded, courseDeletedAll } = coursesSlice.actions
export default coursesSlice.reducer
