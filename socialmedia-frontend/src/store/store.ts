import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice"
export const store = configureStore({
  reducer: {
    global: userSlice,
  },
});

// Infer types for TypeScript (if applicable)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
