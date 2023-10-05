import { createSlice } from '@reduxjs/toolkit'

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    courseAdded(state, action) {
      state.push(action.payload)
    },
    courseDeletedAll(state, action) {
      state = []
    }
    // courseToggled(state, action) {
    //   const course = state.find(course => course.id === action.payload)
    //   course.completed = !course.completed
    // }
  }
})

export const { courseAdded, courseDeletedAll } = coursesSlice.actions
export default coursesSlice.reducer