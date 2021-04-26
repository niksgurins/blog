import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        name: ''
    },
    reducers: {
        setUser: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            console.log(state);
            console.log(action);
            state.id = action.payload.id;
            state.name = action.payload.name;
        },
        clearUser: (state) => {
            state.id = '';
            state.name = '';
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer