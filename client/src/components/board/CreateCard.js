import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getLists, sortingLists } from "../../features/lists/listsSlice";
import { addCard } from "../../features/card/cardsSlice";

import OutsideClick from "../../hooks/outsideClick";
export const CreateCard = ({
  xPos,
  yPos,
  moveForm,
  listId,
  boards,
  formShow,
  closeForm,
}) => {
  const params = useParams();
  const dispatch = useDispatch();

  const [nameCard, setNameCard] = useState("");

  const onNameCardChange = (e) => setNameCard(e.target.value);

  const createCard = () => {
    if (nameCard.replace(/ /g, "").length <= 0 || !listId) {
      cardInput.current.focus();
      return null;
    }

    const { boardId } = params;

    // when the card was render(added on the state in redux)
    //  then the popup moves down
    dispatch(addCard({ nameCard, boardId, listId })).then(() => {
      dispatch(getLists(boardId)).then(() => {
        dispatch(sortingLists(boards));
        moveForm();
      });
    });

    setNameCard("");

    cardInput.current.focus();
  };

  // because initial xPos is give some different position
  xPos -= 136.5;
  yPos -= 190;
  const styles = {
    transform: `translate(${xPos}px, ${yPos}px)`,
  };

  const cardInput = useRef(null);
  const cardFormRef = useRef(null);
  OutsideClick(cardFormRef, closeForm);

  if (!formShow) return null;
  return (
    <div style={styles} className="form-createCard" ref={cardFormRef}>
      <textarea
        placeholder="Enter a title for this card…"
        value={nameCard}
        onChange={onNameCardChange}
        ref={cardInput}
      />
      <button onClick={createCard}>Add card</button>
      <button onClick={closeForm}>X</button>
    </div>
  );
};
