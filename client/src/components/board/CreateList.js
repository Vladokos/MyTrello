import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getBoard } from "../../features/boards/boardsSlice";
import { addList } from "../../features/lists/listsSlice";

import OutsideClick from "../../hooks/outsideClick";

export const CreateList = () => {
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

    dispatch(addList({ nameList, boardId }));
    dispatch(getBoard(boardId));

    setNameList("");

    listInput.current.focus();
  };

  const listInput = useRef(null);
  const listFormRef = useRef(null);
  OutsideClick(listFormRef, () => setListFormShow(false));
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
          ref={listInput}
          type="text"
          placeholder="Enter list name"
          value={nameList}
          onChange={onNameListChange}
        />
        <button onClick={createList}>Add list</button>
        <button onClick={visibleListCreate}>X</button>
      </div>
    </li>
  );
};