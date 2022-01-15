import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  cards: [],
  status: "idle",
};

export const getCards = createAsyncThunk("cards/getCards", async (idBoard) => {
  const response = await axios({
    config: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    method: "POST",
    url: "/board/list/card/get",
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

export const addCard = createAsyncThunk(
  "cards/addCard",
  async ({ nameCard, idBoard, idList }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/create",
      data: {
        nameCard,
        idBoard,
        idList
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

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getCards.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(addCard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards.push(action.payload);
      })
  },
});

export const { sortingCards } = cardsSlice.actions;

export default cardsSlice.reducer;
