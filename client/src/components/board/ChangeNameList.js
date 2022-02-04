import React, { useState, useRef } from "react";

import { useDispatch } from "react-redux";
import { changeName } from "../../features/lists/listsSlice";

import OutsideClick from "../../hooks/outsideClick";

export const ChangeNameList = ({
  xPos,
  yPos,
  nameList,
  listId,
  changeNameList,
  listFormShow,
  closeForm,
}) => {
  const dispatch = useDispatch();

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      dispatch(changeName({ listId, nameList })).then(() => closeForm());
    }
  };

  const input = useRef(null);
  OutsideClick(input, () => closeForm());

  xPos -= 138.5;
  yPos -= 196;
  const styles = {
    position: "absolute",
    transform: `translate(${xPos}px, ${yPos}px)`,
  };
  if (!listFormShow) return null;
  return (
    <div style={styles} className="changeNameList">
      <input
        value={nameList}
        onChange={(e) => changeNameList(e.target.value)}
        onKeyDown={sendForm}
        ref={input}
      />
    </div>
  );
};
