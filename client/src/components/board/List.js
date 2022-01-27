import React from "react";

import { Card } from "./Card";

export const List = ({ lists, cards, boardId, visibleCardCreate }) => {
  return (
    <ul>
      {lists.length > 0
        ? lists.map((list) => {
            if (list.boardId === boardId) {
              return (
                <li key={list._id} className={"list " + list.nameList}>
                  <div className="list-title">{list.nameList}</div>
                  <Card list={list} cards={cards} />
                  <button
                    onClick={(e) => visibleCardCreate(e)}
                    className={list._id}
                  >
                    Add a card
                  </button>
                </li>
              );
            }
          })
        : null}
    </ul>
  );
};
