import { configureStore } from '@reduxjs/toolkit'
import cardReducer from "./slices/cardSlice"

export default configureStore({
  reducer: {
    card:cardReducer
  }
})

