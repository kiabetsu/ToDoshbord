import { configureStore } from "@reduxjs/toolkit";

import  taskTestSlice  from "./taskTestSlice";
import taskSlice from "./taskSlice";

export const store = configureStore({
  reducer: {
  taskTest: taskTestSlice,
  tasks: taskSlice,
  },
})