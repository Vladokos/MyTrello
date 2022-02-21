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

  const [description, setDescription] = useState("");

  const sendForm = (e) => {
    if (e.type == "blur" || e.key === "Enter" || e.keyCode === 13) {
      switch (e.target.id) {
        case "name":
          dispatch(changeName({ cardId, nameCard }));
          nameInput.current.blur();
          break;
        case "description":
          dispatch(changeDescription({ cardId, description }));
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setDescription(descriptionCard);
  }, [descriptionCard]);

  const nameInput = useRef(false);
  
  const form = useRef(null);
  OutsideClick(form, () => closeForm());

  if (!isOpen) return null;
  return (
    <div>
      <div className="blackBG" style={{ left: 0 }}>
        <div className="changeCard" ref={form}>
          <div className="changeCard-title">Title</div>
          <TextareaAutosize
            id="name"
            value={nameCard}
            onChange={changeNameCard}
            onKeyDown={sendForm}
            onBlur={(e) => {
              sendForm(e);
            }}
            spellCheck="false"
            ref={nameInput}
          />
          <div className="description">Description</div>

          <TextareaAutosize
            id="description"
            placeholder="Add a more detail description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => {
              sendForm(e);
            }}
            spellCheck="false"
          />
          <button onClick={closeForm}>X</button>
        </div>
      </div>
    </div>
  );
};
