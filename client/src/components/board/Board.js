import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "react-redux";
import { getBoard, changeLists, changeData, getBoards } from "../../features/boards/boardsSlice";
import {
  getLists,
  sortingLists,
  changeCards,
} from "../../features/lists/listsSlice";
import { getCards } from "../../features/card/cardsSlice";

import axios from "axios";

import useWindowHeight from "../../hooks/heightWindowHook";

import { Loader } from "../blanks/Loader";
import { Header } from "../blanks/Header";
import { BoardName } from "./BoardName";
import { List } from "./List";
import { CreateList } from "./CreateList";
import { ChangeCard } from "./ChangeCard";
import { ChangeNameCard } from "./ChangeNameCard";
import { Menu } from "./Menu";

import "../../styles/Board/Board.css";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { height } = useWindowHeight();

  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.boards);
  const { lists } = useSelector((state) => state.lists);
  const { cards, status } = useSelector((state) => state.cards);

  const [changeCard, setChangeCard] = useState(false);
  const [changeNameCard, setChangeNameCard] = useState(false);

  const [nameCard, setNameCard] = useState("");
  const [descriptionCard, setDescriptionCard] = useState("");

  const [listId, setListId] = useState(null);
  const [cardId, setCardId] = useState(null);

  const [xPos, setXPos] = useState(null);
  const [yPos, setYPos] = useState(null);

  const visibleChangeCard = (e, id, description) => {
    if (e.target.innerText === "") return null;
    setCardId(id);

    setNameCard(e.target.innerText);
    setDescriptionCard(description);

    setChangeCard(true);
  };

  const visibleChangeNameCard = (e, nameCard, id) => {
    setNameCard(nameCard);

    setCardId(id);

    setXPos(e.target.getBoundingClientRect().x);
    setYPos(e.target.getBoundingClientRect().y);

    setChangeNameCard(true);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    const { boardId } = params;

    if (!accessToken) navigate("/sig");

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
          const date = Date.now();
          dispatch(changeData({boardId, date}));

          dispatch(getBoard(boardId));

          dispatch(getBoards(userId));

          dispatch(getLists(boardId));

          dispatch(getCards(boardId));
        }
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
      });
  }, []);

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

  const [drag, setDrag] = useState(false);

  return status !== "succeeded" ? (
    <Loader />
  ) : (
    <div className="boardMenu" style={{ height: height }}>
      <Header boards={boards} />
      <div className="lists" style={{ height: height - 127 }}>
        <div className="container">
          <div className="lists__inner" style={{ height: height - 200 }}>
            <div className="action-board">
              {boards.map((board) => {
                if(board._id === params.boardId){
                  return(
                    <BoardName key={board._id} name={board.nameBoard} />
                  )
                }
              
              })}
              <Menu height={height - 108} lists={lists} cards={cards} />
            </div>

            <ul
              className="scrollBoard"
              style={drag === false ? { transform: `translateZ(10px)` } : null}
            >
              <DragDropContext
                onDragStart={() => setDrag(true)}
                onDragEnd={(e) => {
                  onDrop(e);
                  setDrag(false);
                }}
              >
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
                      {lists.map((list, index) =>
                        !list.archived ? (
                          <List
                            key={listId + index}
                            boards={boards}
                            listId={list._id}
                            listName={list.nameList}
                            listCards={list.cards}
                            index={index}
                            cards={cards}
                            visibleChangeCard={visibleChangeCard}
                            visibleChangeNameCard={visibleChangeNameCard}
                            height={height - 307}
                          />
                        ) : null
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <CreateList />
            </ul>
            <ChangeCard
              nameCard={nameCard}
              descriptionCard={descriptionCard}
              changeDescription={(e) => setDescriptionCard(e.target.value)}
              cardId={cardId}
              changeCard={(e) => setNameCard(e.target.value)}
              isOpen={changeCard}
              closeForm={() => setChangeCard(false)}
            />

            {changeNameCard === false ? null : (
              <ChangeNameCard
                nameCard={nameCard}
                changeNameCard={(e) => setNameCard(e.target.value)}
                cardId={cardId}
                closeForm={() => setChangeNameCard(false)}
                xPos={xPos}
                yPos={yPos}
                height={height - 270}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
