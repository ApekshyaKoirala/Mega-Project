import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
const store = configureStore({
    reducer: {
        auth: authSlice,
        //todo add more reducers for post like postslice
    }
})
export default store;