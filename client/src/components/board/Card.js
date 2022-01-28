import React from "react";

import { Draggable } from "react-beautiful-dnd";

export const Card = ({ card, index }) => {
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
            <li className="card">{card.nameCard}</li>
            {/* {list.cards.map((cardId) => {
              return cards.map((card) => {
                if (cardId === card._id) {
                  return (
                    <li key={card._id} className="card">
                      {card.nameCard}
                    </li>
                  );
                }
              });
            })} */}
          </div>
        </div>
      )}
    </Draggable>
  );
};
