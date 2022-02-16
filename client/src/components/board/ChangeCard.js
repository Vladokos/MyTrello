import React, { useRef, useState, useEffect } from "react";

import { useDispatch } from "react-redux";

import { changeName, changeDescription } from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

import OutsideClick from "../../hooks/outsideClick";

export const ChangeCard = ({
  nameCard,
  descriptionCard,
  cardId,
  changeNameCard,
  isOpen,
  closeForm,
}) => {
  const dispatch = useDispatch();

  const form = useRef(null);
  OutsideClick(form, () => closeForm());

  const [description, setDescription] = useState("");

  useEffect(() => {
    setDescription(descriptionCard);
  }, [descriptionCard]);

  if (!isOpen) return null;

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      switch (e.target.id) {
        case "name":
          dispatch(changeName({ cardId, nameCard }));
          break;
        case "description":
          dispatch(changeDescription({ cardId, description }));
          break;
        default:
          break;
      }
    }
  };

  return (
    <div>
      <div className="blackBG" style={{ left: 0 }}>
        <div className="changeCardName" ref={form}>
          <div className="changeCardName-title">Title</div>
          <TextareaAutosize
            id="name"
            value={nameCard}
            onChange={changeNameCard}
            onKeyDown={sendForm}
          />
          <div className="description">Description</div>
          <TextareaAutosize
            id="description"
            placeholder="Add a more detail description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={sendForm}
          />
          <button onClick={closeForm}>X</button>
        </div>
      </div>
    </div>
  );
};
