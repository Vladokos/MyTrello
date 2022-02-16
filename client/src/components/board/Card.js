import React from "react";

import { Draggable } from "react-beautiful-dnd";

import descriptionImg from "../../img/description.svg";

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
            <div
              className="card"
              key={card._id}
              onClick={(e) =>
                visibleChangeNameCard(e, card._id, card.descriptionCard)
              }
            >
              {card.nameCard}
              {card.descriptionCard.length !== 0 ? (
                <div>
                  <img src={descriptionImg} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
