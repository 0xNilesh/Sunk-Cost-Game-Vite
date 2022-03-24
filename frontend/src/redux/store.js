import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import potsReducer from "./potSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        pots: potsReducer,
    },
});
