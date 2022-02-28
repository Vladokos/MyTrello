import React, { useState, useRef } from "react";

import { useDispatch } from "react-redux";
import { changeName } from "../../features/lists/listsSlice";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Card } from "./Card";

import TextareaAutosize from "react-textarea-autosize";

import dots from "../../img/dots.svg";

import OutsideClick from "../../hooks/outsideClick";

export const List = ({
  listId,
  listName,
  listCards,
  index,
  cards,
  visibleCardCreate,
  visibleChangeCard,
  visibleChangeNameCard,
  height,
}) => {
  const dispatch = useDispatch();

  const [nameList, setNameList] = useState(listName);
  const [actionShow, setActionShow] = useState(false);

  const sendForm = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      dispatch(changeName({ listId, nameList }));
      e.target.blur();
    }
  };

  const actionsFrom = useRef(null);
  OutsideClick(actionsFrom, () => setActionShow(false));
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
                <div className="list-title">
                  <TextareaAutosize
                    value={nameList}
                    onChange={(e) => setNameList(e.target.value)}
                    onKeyDown={sendForm}
                    spellCheck="false"
                  />
                  <img src={dots} onClick={() => setActionShow(!actionShow)} />
                  <div
                    className={actionShow === false ? "hidden" : "active"}
                    ref={actionsFrom}
                  >
                    <img
                      src={dots}
                      onClick={() => setActionShow(!actionShow)}
                    />
                    <div>Archive list</div>
                    <div>Delete list</div>
                  </div>
                </div>
                <div className="draggable-list" style={{ maxHeight: height }}>
                  {listCards.map((cardId, index) => {
                    return cards.map((card) => {
                      if (card._id === cardId)
                        return (
                          <Card
                            key={card._id}
                            card={card}
                            index={index}
                            visibleChangeCard={visibleChangeCard}
                            visibleChangeNameCard={visibleChangeNameCard}
                          />
                        );
                    });
                  })}
                </div>

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
