import React, { useLayoutEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addBoards } from "../features/boards/boardsSlice";

import "../styles/CreateBoard.css";

export const CreateBoards = ({ createShow, changeShow, height }) => {
  const navigate = useNavigate();
  const params = useParams();

  const { boards } = useSelector((state) => state.boards);
  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState("");

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  const createBoard = () => {
    const { id } = params;

    if (nameBoard.trim().length < 1) return;

    dispatch(addBoards({ id, nameBoard }));

    setNameBoard("");

    changeShow();
  };

  const [firstUpdate, setFirstUpdate] = useState(true);
  useLayoutEffect(() => {
    if (firstUpdate === true) {
      setFirstUpdate(false);
      console.log("asd");
      return;
    }
      const boardId = boards[boards.length - 1]._id;
      const boardName = boards[boards.length - 1].nameBoard;
  
      console.log(boardId, boardName);
      // navigate("/board/" + boardId + "/" + boardName);
    
    
  }, [boards]);

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
