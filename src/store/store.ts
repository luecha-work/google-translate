import { configureStore } from "@reduxjs/toolkit";
import googleCloudSpeakingReducer from "./slices/googleCloudSpeakingSlice";

const store = configureStore({
  reducer: {
    googleCloudSpeaking: googleCloudSpeakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
