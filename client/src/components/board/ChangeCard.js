import React, { useRef, useState, useEffect } from "react";

import { useDispatch } from "react-redux";

import {
  changeName,
  changeDescription,
  deleteCard,
  archiveCard,
} from "../../features/card/cardsSlice";

import TextareaAutosize from "react-textarea-autosize";

import OutsideClick from "../../hooks/outsideClick";

import recycling from "../../img/recycling.svg";
import archive from "../../img/archive.svg";

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
  const [visible, setVisible] = useState("none");

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.type === "click") {
      switch (e.target.id) {
        case "name":
          dispatch(changeName({ cardId, nameCard }));
          nameInput.current.blur();
          break;
        case "description":
          dispatch(changeDescription({ cardId, description }));
          break;
        case "delete":
          dispatch(deleteCard({ cardId }));
          closeForm();
          break;
        case "archive":
          dispatch(archiveCard({ cardId }));
          closeForm();
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
  const descript = useRef(null);

  OutsideClick(form, () => closeForm());
  OutsideClick(descript, () => setVisible("none"));

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
          <div className="description" ref={descript}>
            Description
            <TextareaAutosize
              placeholder="Add a more detail description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              spellCheck="false"
              onFocus={() => setVisible("block")}
            />
            <button
              id="description"
              onClick={(e) => {
                setVisible("none");
                sendForm(e);
              }}
              style={{ display: visible }}
            >
              Save
            </button>
            <button
              id="description"
              onClick={() => setVisible("none")}
              style={{ display: visible }}
            >
              X
            </button>
          </div>
          <button onClick={closeForm}>X</button>
          <img id="delete" src={recycling} onClick={sendForm} />
          <img id="archive" src={archive} onClick={sendForm} />
        </div>
      </div>
    </div>
  );
};
