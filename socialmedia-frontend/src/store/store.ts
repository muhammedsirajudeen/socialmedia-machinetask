import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// Define persist config explicitly
const persistConfig: PersistConfig<ReturnType<typeof userSlice>> = {
  key: "global", // Changed key to match the slice
  storage,
};

// Wrap the user slice reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userSlice);

export const store = configureStore({
  reducer: {
    global: persistedReducer, // Use persistedReducer correctly
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid warnings for non-serializable data
    }),
});

// Create a persistor
export const persistor = persistStore(store);

// Infer types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
