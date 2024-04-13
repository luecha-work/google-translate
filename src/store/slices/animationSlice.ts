import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnimationState {
  isPlayingAnimation: boolean;
}

const initialState: AnimationState = {
  isPlayingAnimation: false,
};

const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    toggleAnimation: (state, action: PayloadAction<boolean>) => {
      state.isPlayingAnimation = action.payload;
    },
  },
});

export const { toggleAnimation } = animationSlice.actions;

export default animationSlice.reducer;
