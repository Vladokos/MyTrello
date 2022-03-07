import React from "react";

import recycling from "../../img/recycling.svg";
import restore from "../../img/restore.svg";

import "../../styles/Board/ArchiveCard.css";

export const ArchiveCard = ({ height, back, close, cards }) => {
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
                <img src={restore} />
                <img src={recycling} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
