import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { changeName } from "../../features/boards/boardsSlice";

import AutosizeInput from "react-input-autosize";

import OutsideClick from "../../hooks/outsideClick";

import "../../styles/Board/BoardName.css";

export const BoardName = ({ name, socket }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const [nameBoard, setNameBoard] = useState("");
  const [visibleInput, setVisibleInput] = useState(false);
  const [width, setWidth] = useState(null);

  const onNameBoardChange = (e) => {
    setNameBoard(e.target.value);
  };

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      const { boardId } = params;
      dispatch(changeName({ nameBoard, boardId })).then(() => {
        socket.emit("bond", { roomId: boardId, message: "board changed" });
      });
    }
  };

  useEffect(() => {
    setNameBoard(name);
  }, [name]);

  return (
    <div className="changeBoardName">
      <div
        className={visibleInput ? "hidden" : "boardName"}
        style={{ width: width }}
      >
        <AutosizeInput
          value={nameBoard}
          onChange={onNameBoardChange}
          onKeyDown={sendForm}
        />
      </div>
    </div>
  );
};
