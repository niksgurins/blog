import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        firstName: '',
        lastName: '',
        intro: '',
        signedIn: false
    },
    reducers: {
        setUser: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.id = action.payload.id;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.intro = action.payload.intro;
            state.signedIn = true;
        },
        clearUser: (state) => {
            state.id = '';
            state.firstName = '';
            state.lastName = '';
            state.intro = '';
            state.signedIn = false;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer