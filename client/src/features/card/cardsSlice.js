import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  cards: [],
  status: "idle",
};

export const getCards = createAsyncThunk("cards/getCards", async (boardId) => {
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
});

export const addCard = createAsyncThunk(
  "cards/addCard",
  async ({ nameCard, boardId, listId }) => {
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
        boardId,
        listId,
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
  "cards/changeName",
  async ({ cardId, nameCard }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/changeName",
      data: {
        cardId,
        nameCard,
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
  reducers: {},
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
      .addCase(changeName.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeName.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { cardId, nameCard } = action.payload;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards[i].nameCard = nameCard;
          }
        }
      });
  },
});

export default cardsSlice.reducer;
