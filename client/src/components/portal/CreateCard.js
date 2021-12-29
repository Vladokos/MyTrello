import React, { useState } from "react";
import ReactDOM from "react-dom";

const CreateCard = ({ xPos, yPos, isOpen, closeForm }) => {
  if (!isOpen) return null;

  // because initial xPos is give some different position
  xPos -= 10;

  const styles = {
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  return ReactDOM.createPortal(
    <div style={styles} className="form-createCard">
      <textarea placeholder="Enter a title for this card…" />
      <button>Add card</button>
      <button onClick={closeForm}>X</button>
    </div>,
    document.body
  );
};

export default CreateCard;
