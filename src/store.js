import { configureStore } from '@reduxjs/toolkit'
import coursesReducer from './components/coursesSlice'

export const store = configureStore({
  reducer: {
    courses: coursesReducer
  }
})