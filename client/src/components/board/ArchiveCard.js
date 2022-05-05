import React from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import { unarchiveCard, deleteCard } from "../../features/card/cardsSlice";

import recycling from "../../img/recycling.svg";
import restore from "../../img/restore.svg";

import "../../styles/Board/ArchiveCard.css";

export const ArchiveCard = ({ height, back, close, cards, socket }) => {
  const params = useParams();

  const { boardId } = params;

  const dispatch = useDispatch();

  const unarchive = (cardId) =>
    dispatch(unarchiveCard({ cardId })).then(() => {
      socket.emit("bond", {
        roomId: boardId,
        message: "card changed",
        cardId,
      });
    });
  const deleting = (cardId) =>
    dispatch(deleteCard({ cardId })).then(() => {
      socket.emit("bond", {
        roomId: boardId,
        message: "card deleted",
        cardId,
      });
    });

  return (
    <div className="archive" style={{ height: height - 90 }}>
      <div className="archiveTitle">
        <button onClick={back}>&#60;</button>
        Archived Cards
        <button onClick={close}>X</button>
      </div>
      <hr />
      <ul className="archivedLists">
        {cards.map((card) => {
          if (card.archived) {
            return (
              <li key={card._id}>
                {card.nameCard}
                <img src={restore} onClick={() => unarchive(card._id)} />
                <img src={recycling} onClick={() => deleting(card._id)} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
