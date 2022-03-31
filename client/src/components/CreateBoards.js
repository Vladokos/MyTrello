import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { addBoards } from "../features/boards/boardsSlice";

import "../styles/CreateBoard.css";

export const CreateBoards = ({ createShow, changeShow, height }) => {
  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState("");

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  const createBoard = () => {
    const { id } = params;

    if (nameBoard.trim().length < 1) return;

    dispatch(addBoards({ id, nameBoard })).then(() => {
  
    });

    setNameBoard("");

    changeShow();

    // navigate("/board/" +)
    // <Link
    //   to={"/board/" + board._id + "/" + board.nameBoard}
    //   key={board._id}
    // ></Link>;
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
