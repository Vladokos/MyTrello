import React from "react";

import { Droppable } from "react-beautiful-dnd";

import { Card } from "./Card";

export const List = ({
  listId,
  listName,
  listCards,
  cards,
  boardId,
  visibleCardCreate,
}) => {
  return (
    <Droppable droppableId={listId} direction="horizontal">
      {(provided) => (
        <ul {...provided.droppableProps} ref={provided.innerRef}>
          {/* { if(list.boardId === boardId) { */}

          <li key={listId} className={"list " + listName}>
            <div className="list-title">{listName}</div>
            {cards.map((card, index) => {
              if (listCards.includes(card._id))
                return <Card card={card} index={index} />;
            })}

            <button onClick={(e) => visibleCardCreate(e)} className={listId}>
              Add a card
            </button>
          </li>

          {/* }} */}

          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};
