import React, { useState } from "react";
import ReactDOM from "react-dom";

const CreateCard = ({
  xPos,
  yPos,
  isOpen,
  nameCard,
  onNameCardChange,
  closeForm,
  sendForm,
  refComponent,
}) => {
  if (!isOpen) return null;

  // because initial xPos is give some different position
  xPos -= 10;

  const styles = {
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  return ReactDOM.createPortal(
    <div style={styles} className="form-createCard">
      <textarea
        ref={refComponent}
        placeholder="Enter a title for this card…"
        value={nameCard}
        onChange={onNameCardChange}
      />
      <button onClick={sendForm}>Add card</button>
      <button onClick={closeForm}>X</button>
    </div>,
    document.body
  );
};

export default CreateCard;
