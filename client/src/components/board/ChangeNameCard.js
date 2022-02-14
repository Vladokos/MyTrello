import React from "react";

import { useDispatch } from "react-redux";

import { changeName } from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

export const ChangeNameCard = ({
  nameCard,
  cardId,
  changeNameCard,
  closeForm,
}) => {
  const dispatch = useDispatch();

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      dispatch(changeName({ cardId, nameCard })).then(() => closeForm());
    }
  };

  return (
    <div className="changeCardName">
      <TextareaAutosize
        value={nameCard}
        onChange={changeNameCard}
        onKeyDown={sendForm}
      />
      <button onClick={closeForm}>X</button>
    </div>
  );
};
