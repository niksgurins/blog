import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reduxSlices/userSlice'

export default configureStore({
    reducer: {
        user: userReducer,
    },
})