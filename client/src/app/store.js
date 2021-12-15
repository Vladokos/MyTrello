import { configureStore } from '@reduxjs/toolkit';

import boardsReducer from "../features/boards/boardsSlice";
import listsSlice from '../features/lists/listsSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    lists: listsSlice,
  },
});
