import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        firstName: '',
        lastName: '',
        intro: '',
        img: '',
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
            state.img = action.payload.img;
            state.signedIn = true;
        },
        clearUser: (state) => {
            state.id = '';
            state.firstName = '';
            state.lastName = '';
            state.intro = '';
            state.img = '';
            state.signedIn = false;
        },
        setUserImage: (state, action) => {
            state.img = action.payload.img;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser, setUserImage } = userSlice.actions

export default userSlice.reducer