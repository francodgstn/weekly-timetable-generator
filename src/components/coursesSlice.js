import { createSlice } from '@reduxjs/toolkit'
import sampleTimetableData from '../sample-timetable-data.json'



const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    importCourses (state, action) {
      return action.payload
    },
    addCourse (state, action) {
      state.push(action.payload)
    },
    deletedAllCourses (state, action) {
      return []
    },
    loadSampleData (state, action) {
      return sampleTimetableData
    }
  }
})

export const { 
  importCourses,
  addCourse,
  deletedAllCourses,
  loadSampleData
 } = coursesSlice.actions
export default coursesSlice.reducer
