import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getBoard } from "../../features/boards/boardsSlice";
import { addList } from "../../features/lists/listsSlice";

import OutsideClick from "../../hooks/OutsideClick";

import "../../styles/Board/CreateList.css";

export const CreateList = ({ socket }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const [nameList, setNameList] = useState("");
  const [listFormShow, setListFormShow] = useState(false);

  const onNameListChange = (e) => setNameList(e.target.value);
  const visibleListCreate = () => setListFormShow(!listFormShow);

  const createList = () => {
    if (nameList.replace(/ /g, "").length <= 0) {
      listInput.current.focus();
      return null;
    }

    const { boardId } = params;

    dispatch(addList({ nameList, boardId })).then(() => {
      socket.emit("bond", { roomId: boardId, message: "list added" });
      dispatch(getBoard(boardId));
    });

    setNameList("");
  };

  const listInput = useRef(null);
  const listFormRef = useRef(null);
  OutsideClick(listFormRef, () => setListFormShow(false));

  useEffect(() => {
    listInput?.current?.focus?.();
  }, [listInput]);
  return (
    <li className="createList">
      <button onClick={visibleListCreate} className="createList-button">
        Add a list
      </button>
      <div
        className={listFormShow === false ? "hidden" : "add-list"}
        ref={listFormRef}
      >
        <input
          ref={(e) => e?.focus?.()}
          type="text"
          placeholder="Enter list name"
          value={nameList}
          onChange={onNameListChange}
          onKeyDown={(e) => (e.key === "Enter" ? createList() : null)}
        />
        <button onClick={createList}>Add list</button>
        <button onClick={visibleListCreate}>X</button>
      </div>
    </li>
  );
};
