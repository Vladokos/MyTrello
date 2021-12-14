import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  boards: [],
  status: "idle",
};

export const getBoard = createAsyncThunk("boards/getBoard", async (id) => {
  const response = await axios.get("/boards/" + id + "/one").then((response) => {
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
        state.boards = state.boards.concat(action.payload);
      })
      .addCase(getBoards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = state.boards.concat(action.payload);
      })
      .addCase(addBoards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards.push(action.payload);
      });
  },
});

export default boardsSlice.reducer;
