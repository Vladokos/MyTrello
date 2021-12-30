import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  lists: [],
  status: "idle",
};

export const getLists = createAsyncThunk("lists/getLists", async (idBoard) => {
  const response = await axios({
    config: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    method: "POST",
    url: "/board/lists/get",
    data: {
      idBoard,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
});

export const addList = createAsyncThunk(
  "lists/addList",
  async ({ nameList, idBoard }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/create",
      data: {
        nameList,
        idBoard,
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

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    clearListsState(state, action) {
      state.lists = [];
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLists.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = state.lists.concat(action.payload);
      })
      .addCase(addList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists.push(action.payload);
      });
  },
});

export const { clearListsState } = listsSlice.actions;

export default listsSlice.reducer;
