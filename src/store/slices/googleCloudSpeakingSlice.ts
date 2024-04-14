import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GoogleCloudSpeakingState {
  isPlayingAnimation: boolean;
  transcribedText: string;
}

const initialState: GoogleCloudSpeakingState = {
  isPlayingAnimation: false,
  transcribedText: "",
};

const googleCloudSpeakingSlice = createSlice({
  name: "GoogleCloud",
  initialState,
  reducers: {
    toggleAnimation: (state, action: PayloadAction<boolean>) => {
      state.isPlayingAnimation = action.payload;
    },
    setTranscribedText: (state, action: PayloadAction<string>) => {
      state.transcribedText = action.payload;
    },
  },
});

export const { toggleAnimation, setTranscribedText } =
  googleCloudSpeakingSlice.actions;

export default googleCloudSpeakingSlice.reducer;

export const getIsPlayingAnimation = (state: RootState) =>
  state.googleCloudSpeaking.isPlayingAnimation;

export const getTranscribedText = (state: RootState) =>
  state.googleCloudSpeaking.transcribedText;
