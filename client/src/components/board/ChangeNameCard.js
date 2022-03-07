import React, { useRef } from "react";

import { useDispatch } from "react-redux";

import { changeName } from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

import OutsideClick from "../../hooks/outsideClick";

import "../../styles/Board/ChangeNameCard.css";

export const ChangeNameCard = ({
  nameCard,
  changeNameCard,
  cardId,
  closeForm,
  xPos,
  yPos,
  height,
}) => {
  const dispatch = useDispatch();

  const sendForm = () => {
    dispatch(changeName({ cardId, nameCard }));
    closeForm();
  };

  const form = useRef(null);

  OutsideClick(form, () => closeForm());

  // xPos -= 228;
  // yPos -= 7;
  // transform: translate(792px, 298px);
  // transform: translate(810px, 297px);

  yPos > height ? (yPos = height) : (yPos -= 7);

  return (
    <div
      className="blackBG"
      style={{
        left: 0,
        backgroundColor: "#0009",
      }}
    >
      <div
        className="changeNameCard"
        ref={form}
        style={{ transform: `translate(${xPos - 228}px, ${yPos}px)` }}
      >
        <TextareaAutosize
          id="name"
          value={nameCard}
          onChange={changeNameCard}
        />
        <button onClick={sendForm}>Save</button>
      </div>
    </div>
  );
};
