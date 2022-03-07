import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { changeName } from "../../features/boards/boardsSlice";

import AutosizeInput from "react-input-autosize";

import OutsideClick from "../../hooks/outsideClick";

import "../../styles/Board/BoardName.css";

export const BoardName = ({ name }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState(name);
  const [visibleInput, setVisibleInput] = useState(false);

  const onNameBoardChange = (e) => {
    setNameBoard(e.target.value);
  };

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      const { boardId } = params;
      dispatch(changeName({ nameBoard, boardId })).then(() =>
        setVisibleInput(false)
      );
    }
  };
  const nameInput = useRef(false);
  const nameForm = useRef(0);
  OutsideClick(nameForm, () => {
    setVisibleInput(false);
  });

  useEffect(() => {
    nameInput?.current?.focus?.();
  }, [nameInput]);
  return (
    <div className="changeBoardName">
      <div
        onClick={() => {
          setVisibleInput(true);
        }}
        className={visibleInput ? "hidden" : "boardName"}
        style={{ width: nameForm.current.offsetWidth }}
      >
        {name}
      </div>
      <div
        className={visibleInput ? "visible" : "hiddenBoardName"}
        ref={nameForm}
      >
        <AutosizeInput
          ref={(e) => e?.focus?.()}
          value={nameBoard}
          onChange={onNameBoardChange}
          onKeyDown={sendForm}
        />
      </div>
    </div>
  );
};
