import React, { useRef } from "react";

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
  xPos -= 135;
  yPos -= 132;
  const styles = {
    position: "absolute",
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  console.log(listId)
  const input = useRef(null);
//   OutsideClick(input, () => {console.log(listId)});
  if (!listFormShow) return null;
  return (
    <div style={styles} className="changeNameList">
      <input
        value={nameList}
        onChange={(e) => changeNameList(e.target.value)}
        ref={input}
      />
    </div>
  );
};
