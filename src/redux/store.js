import { configureStore } from "@reduxjs/toolkit";
import taskSlice from "./taskSlice"

const store = configureStore({
    reducer: {
        taskSelector: taskSlice
    }
});

export default store