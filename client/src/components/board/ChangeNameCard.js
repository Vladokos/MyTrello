import React, { useRef } from "react";

import { useDispatch } from "react-redux";

import { changeName } from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

import OutsideClick from "../../hooks/outsideClick";

export const ChangeNameCard = ({
  nameCard,
  changeNameCard,
  cardId,
  closeForm,
  xPos,
  yPos,
}) => {
  const dispatch = useDispatch();

  const sendForm = () => {
    dispatch(changeName({ cardId, nameCard }));
    closeForm();
  };

  const form = useRef(null);

  OutsideClick(form, () => closeForm());

  xPos -= 245;
  yPos -= 4;
  const styles = {
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  return (
    <div className="blackBG" style={{ left: 0, backgroundColor: "#0009" }}>
      <div className="changeNameCard" ref={form} style={styles}>
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
