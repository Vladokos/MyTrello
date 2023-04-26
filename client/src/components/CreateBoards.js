import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addBoards } from "../features/boards/boardsSlice";

import "../styles/CreateBoard.css";

import OutsideClick from "../hooks/OutsideClick";
import { store } from "../app/store";

let firstUpdate = null;

export const CreateBoards = ({ createShow, changeShow, height, boards }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState("");

  const menuRef = useRef(null);

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  const createBoard = () => {
    const id = localStorage.getItem("userId");

    if (nameBoard.trim().length < 1) return;

    dispatch(addBoards({ id, nameBoard })).then(() => {
      setNameBoard("");

      boards = store.getState().boards.boards;
      const { _id, nameBoard } = boards[boards.length - 1];

      changeShow();

      navigate("/board/" + _id + "/" + nameBoard);
    });
  };

  useEffect(() => {
    if (!firstUpdate) {
      firstUpdate = boards.length;
      return;
    } else if (boards.length > firstUpdate) {
      // console.log(boards[boards.length - 1]._id)
      // firstUpdate = null;
      // const boardId = boards[boards.length - 1]._id;
      // const boardName = boards[boards.length - 1].nameBoard;
      // navigate("/board/" + boardId + "/" + boardName);
    }
  }, [boards.length]);

  OutsideClick(menuRef, () => changeShow());
  return (
    <div
      className={createShow === false ? "hidden" : "menuCreateBoard"}
      style={{ height: height }}
    >
      <div className="blackBG">
        <div className="menuCreateBoard__inner" ref={menuRef}>
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
