import React from "react";

import { Draggable } from "react-beautiful-dnd";

export const Card = ({ card, index, visibleChangeNameCard }) => {
  return (
    <Draggable
      key={card._id}
      draggableId={card._id}
      index={index}
      id={card._id}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="cards">
            <div className="card" key={card._id} onClick={(e) => visibleChangeNameCard(e, card._id)}>
              {card.nameCard}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
