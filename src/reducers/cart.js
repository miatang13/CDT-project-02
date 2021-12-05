import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    value: [],
  },
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { add } = cartSlice.actions;
export default cartSlice.reducer;
