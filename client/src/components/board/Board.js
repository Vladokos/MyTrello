import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "react-redux";
import { getBoard, changeLists } from "../../features/boards/boardsSlice";
import {
  getLists,
  sortingLists,
  changeCards,
} from "../../features/lists/listsSlice";
import { getCards, addCard } from "../../features/card/cardsSlice";

import axios from "axios";

import useWindowHeight from "../../hooks/heightWindowHook";
import OutsideClick from "../../hooks/outsideClick";

import { CreateCard } from "../portal/CreateCard";
import { ChangeNameList } from "../portal/ChangeNameList";

import { Header } from "../blanks/Header";
import { List } from "./List";
import { CreateList } from "./CreateList";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { height } = useWindowHeight();

  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.boards);
  const { lists } = useSelector((state) => state.lists);
  const { cards } = useSelector((state) => state.cards);

  const [cardFormShow, setCardFormShow] = useState(false);

  const [nameCard, setNameCard] = useState("");
  const [listId, setListId] = useState("");

  const [xPos, setXPos] = useState(null);
  const [yPos, setYPos] = useState(null);

  const cardFormRef = useRef(null);
  const cardInput = useRef(null);

  const visibleCardCreate = (e) => {
    setListId(e.target.className);

    setXPos(e.target.getBoundingClientRect().x);
    setYPos(e.target.getBoundingClientRect().y);

    setCardFormShow(true);
  };

  const onNameCardChange = (e) => setNameCard(e.target.value);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    const { boardId } = params;

    if (accessToken === "undefined" || accessToken === null) navigate("/sig");

    axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/token/verify",
      data: {
        accessToken: JSON.parse(accessToken),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch(getLists(boardId));
          dispatch(getBoard(boardId));
          dispatch(getCards(boardId));
        }
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
      });
  }, []);

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
        setYPos(yPos + 50);
      });
    });

    setNameCard("");

    cardInput.current.focus();
  };

  const onDrop = (e) => {
    if (e.type === "list") {
      const position = e.destination.index;
      const { boardId } = params;
      const currentListId = e.draggableId;

      dispatch(changeLists({ position, boardId, currentListId }));
    } else if (e.type === "card") {
      const fromListId = e.source.droppableId;
      const toListId = e.destination.droppableId;
      const position = e.destination.index;
      const cardId = e.draggableId;

      dispatch(changeCards({ fromListId, toListId, position, cardId }));
    }
  };

  useEffect(() => {
    if (boards.length > 0) {
      dispatch(sortingLists(boards));
    }
  }, [boards]);

  OutsideClick(cardFormRef, () => setCardFormShow(false));
  return (
    <div className="boardMenu" style={{ height: height }}>
      <Header />
      <div className="lists" style={{ height: height - 127 }}>
        <div className="container">
          <div className="lists__inner" style={{ height: height - 127 }}>
            <ul>
              <DragDropContext onDragEnd={onDrop}>
                <Droppable
                  droppableId="lists"
                  direction="horizontal"
                  type="list"
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="sheetList"
                    >
                      {lists.map((list, index) => (
                        <List
                          key={listId + index}
                          listId={list._id}
                          listName={list.nameList}
                          listCards={list.cards}
                          index={index}
                          cards={cards}
                          visibleCardCreate={visibleCardCreate}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <CreateList />

              <CreateCard
                xPos={xPos}
                yPos={yPos}
                isOpen={cardFormShow}
                nameCard={nameCard}
                onNameCardChange={onNameCardChange}
                closeForm={() => setCardFormShow(false)}
                sendForm={createCard}
                refInput={cardInput}
                refForm={cardFormRef}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
