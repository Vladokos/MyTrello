import { configureStore } from '@reduxjs/toolkit';

import boardsReducer from "../features/boards/boardsSlice";

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});
