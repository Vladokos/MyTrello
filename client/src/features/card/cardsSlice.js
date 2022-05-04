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

export const getCard = createAsyncThunk("cards/getCard", async (cardId) => {
  const response = await axios({
    config: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    method: "POST",
    url: "/board/list/card/getOne",
    data: {
      cardId,
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

export const changeDescription = createAsyncThunk(
  "cards/changeDescription",
  async ({ cardId, description }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/changeDescription",
      data: {
        cardId,
        description,
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

export const deleteCard = createAsyncThunk(
  "cards/delete",
  async ({ cardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/deleteCard",
      data: {
        cardId,
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

export const archiveCard = createAsyncThunk(
  "cards/archive",
  async ({ cardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/archive",
      data: {
        cardId,
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

export const unarchiveCard = createAsyncThunk(
  "cards/unarchive",
  async ({ cardId }) => {
    const response = await axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/board/list/card/unarchive",
      data: {
        cardId,
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
    removeCard(state, action) {
      const { cardId } = action;

      for (let i = 0; i < state.cards.length; i++) {
        if (state.cards[i]._id === cardId) {
          state.cards.splice(i, 1);
        }
      }
    },
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
      .addCase(getCard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCard.fulfilled, (state, action) => {
        state.status = "succeeded";

        const cardId = action.payload._id;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards.splice(i, 1, action.payload);
          }
        }
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
      })
      .addCase(changeDescription.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeDescription.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { cardId, description } = action.payload;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards[i].descriptionCard = description.trim();
          }
        }
      })
      .addCase(deleteCard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { cardId } = action.payload;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards.splice(i, 1);
          }
        }
      })
      .addCase(archiveCard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(archiveCard.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { cardId } = action.payload;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards[i].archived = true;
          }
        }
      })
      .addCase(unarchiveCard.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(unarchiveCard.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { cardId } = action.payload;

        for (let i = 0; i < state.cards.length; i++) {
          if (state.cards[i]._id === cardId) {
            state.cards[i].archived = false;
          }
        }
      });
  },
});

export const { removeCard } = cardsSlice.actions;

export default cardsSlice.reducer;
