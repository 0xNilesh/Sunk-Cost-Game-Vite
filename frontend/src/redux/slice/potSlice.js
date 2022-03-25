import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pots: [],
};

export const potsSlice = createSlice({
    name: "pots",
    initialState,
    reducers: {
        loadPots: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.pots = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { loadPots } = potsSlice.actions;

export default potsSlice.reducer;
