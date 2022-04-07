import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { addBoards } from "../features/boards/boardsSlice";

import "../styles/CreateBoard.css";

export const CreateBoards = ({ createShow, changeShow, height }) => {
  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState("");

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  const createBoard = () => {
    const id = localStorage.getItem("userId");

    if (nameBoard.trim().length < 1) return;

    dispatch(addBoards({ id, nameBoard }));

    setNameBoard("");

    changeShow();
  };

  return (
    <div
      className={createShow === false ? "hidden" : "menuCreateBoard"}
      style={{ height: height }}
    >
      <div className="blackBG" onClick={changeShow}></div>
      <div className="container">
        <div className="menuCreateBoard__inner">
          <div className="settingsBoard">
            <input
              type="text"
              placeholder="Add a board name"
              value={nameBoard}
              onChange={onNameBoardChange}
            />
          </div>

          <button
            onClick={createBoard}
            className={nameBoard.length > 0 ? "activeCreate" : ""}
          >
            Create
          </button>
          <button onClick={changeShow}>X</button>
        </div>
      </div>
    </div>
  );
};
