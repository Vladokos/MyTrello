import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

import "../../styles/Board/ChangeCard.css";

export const ChangeCard = ({
  nameCard,
  descriptionCard,
  cardId,
  changeCard,
  isOpen,
  closeForm,
  socket,
}) => {
  const params = useParams();
  const dispatch = useDispatch();

  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState("none");

  const [update, setUpdate] = useState(0);

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.type === "click") {
      const { boardId } = params;

      switch (e.target.id) {
        case "name":
          dispatch(changeName({ cardId, nameCard })).then(() => {
            socket.emit("bond", {
              roomId: boardId,
              message: "card changed",
              cardId,
            });
          });

          nameInput.current.blur();
          break;
        case "description":
          dispatch(changeDescription({ cardId, description })).then(() => {
            socket.emit("bond", {
              roomId: boardId,
              message: "card changed",
              cardId,
            });
          });
          console.log(description);
          setDescription(descriptionCard);
          break;
        case "delete":
          dispatch(deleteCard({ cardId })).then(() => {
            socket.emit("bond", {
              roomId: boardId,
              message: "card deleted",
              cardId,
            });
          });

          closeForm();
          break;
        case "archive":
          dispatch(archiveCard({ cardId })).then(() => {
            socket.emit("bond", {
              roomId: boardId,
              message: "card changed",
              cardId,
            });
          });

          closeForm();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (update < 1) {
      setDescription(descriptionCard);
      setUpdate(update + 1);
    }
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
            onChange={changeCard}
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
