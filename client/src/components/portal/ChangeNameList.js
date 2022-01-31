import React from "react";
import ReactDOM from "react-dom";

export const ChangeNameList = ({ xPos, yPos, isOpen }) => {
  if (!isOpen) return null;

  const styles = {
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  return ReactDOM.createPortal(<div style={styles}></div>, document.body);
};
