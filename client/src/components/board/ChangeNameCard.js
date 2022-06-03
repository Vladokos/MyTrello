import React, { useRef } from "react";
import { useParams} from "react-router-dom";

import { useDispatch } from "react-redux";

import { changeName } from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

import OutsideClick from "../../hooks/OutsideClick";

import "../../styles/Board/ChangeNameCard.css";

export const ChangeNameCard = ({
  nameCard,
  changeNameCard,
  cardId,
  closeForm,
  xPos,
  yPos,
  height,
  socket,
}) => {
  const params = useParams();
  const dispatch = useDispatch();

  const sendForm = () => {
    const { boardId } = params;

    dispatch(changeName({ cardId, nameCard })).then(() => {
      socket.emit("bond", { roomId: boardId, message: "card changed", cardId });
    });
    closeForm();
  };

  const form = useRef(null);

  OutsideClick(form, () => closeForm());

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
