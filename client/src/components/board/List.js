import React from "react";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Card } from "./Card";

export const List = ({
  listId,
  listName,
  listCards,
  index,
  cards,
  visibleCardCreate,
  visibleChangeNameList,
}) => {
  return (
    <Draggable key={listId} draggableId={listId} index={index} id={listId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={listId} type="card">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={"list " + listName}
              >
                <div
                  className="list-title"
                  onClick={(e) => visibleChangeNameList(e, listId)}
                >
                  {listName}
                </div>
                {listCards.map((cardId, index) => {
                  return cards.map((card) => {
                    if (card._id === cardId)
                      return <Card key={card._id} card={card} index={index} />;
                  });
                })}

                {provided.placeholder}
                <div>
                  <button
                    onClick={(e) => visibleCardCreate(e)}
                    className={listId}
                  >
                    Add a card
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
