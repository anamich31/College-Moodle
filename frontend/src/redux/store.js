import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice"; // Adjust the path as needed

const store = configureStore({
    reducer: {
        app: appReducer,
    },
});

export default store;
