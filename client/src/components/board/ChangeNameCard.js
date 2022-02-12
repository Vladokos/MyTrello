import React from "react";

import { TextField } from "@mui/material";

export const ChangeNameCard = ({ nameCard, cardId }) => {
  return (
    <div className="changeCardName">
      <TextField
        value={nameCard}
        label="card title"
        variant="filled"
      />
    </div>
  );
};
