import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  boards: [],
  status: "idle",
};

export const getBoard = createAsyncThunk("boards/getBoard", async (id) => {
  const response = await axios
    .get("/boards/" + id + "/one")
    .then((response) => {
      return response.data;
    });
  return response;
});

export const getBoards = createAsyncThunk("boards/getBoards", async (id) => {
  const response = await axios
    .get("/boards/" + id + "/all")
    .then((response) => {
      return response.data;
    });
  return response;
});

export const addBoards = createAsyncThunk(
  "boards/addBoard",
  async ({ id, nameBoard }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/boards/create",
      data: {
        nameBoard,
        idUser: id,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);
//  change name
export const changeLists = createAsyncThunk(
  "boards/changeListsPosition",
  async ({ position, boardId, currentListId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/move",
      data: {
        position,
        boardId,
        currentListId,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);

export const changeName = createAsyncThunk(
  "boards/changeName",
  async ({ nameBoard, boardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/nameChange",
      data: {
        nameBoard,
        boardId,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);

export const addFavorites = createAsyncThunk(
  "boards/addFavorites",
  async ({ boardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/addFavorites",
      data: {
        boardId,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);

export const removeFavorites = createAsyncThunk(
  "boards/removeFavorites",
  async ({ boardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/removeFavorites",
      data: {
        boardId,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);

export const changeData = createAsyncThunk(
  "boards/changeData",
  async ({ boardId, date }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/changeData",
      data: {
        boardId,
        date,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getBoard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getBoard.fulfilled, (state, action) => {
        state.status = "succeeded";

        // action has an initial state as an object
        // but not as an object in array
        state.boards = [action.payload];
      })
      .addCase(getBoards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(addBoards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards.push(action.payload);
      })
      .addCase(changeLists.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = [action.payload];
      })
      .addCase(changeName.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeName.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { nameBoard, boardId } = action.payload;

        for (let i = 0; i < state.boards.length; i++) {
          if (state.boards[i]._id === boardId) {
            state.boards[i].nameBoard = nameBoard;
          }
        }
      })
      .addCase(addFavorites.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { boardId } = action.payload;

        for (let i = 0; i < state.boards.length; i++) {
          if (state.boards[i]._id === boardId) {
            state.boards[i].favorites = true;
          }
        }
      })
      .addCase(removeFavorites.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(removeFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { boardId } = action.payload;

        for (let i = 0; i < state.boards.length; i++) {
          if (state.boards[i]._id === boardId) {
            state.boards[i].favorites = false;
          }
        }
      })
      .addCase(changeData.pending, (state, action) => {
        state.status = "loading";
      }) .addCase(changeData.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { boardId, date } = action.payload;

        for (let i = 0; i < state.boards.length; i++) {
          if (state.boards[i]._id === boardId) {
            state.boards[i].lastVisiting = date;
          }
        }
      });
  },
});

export default boardsSlice.reducer;
