import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "react-redux";
import { getBoard, changeLists } from "../../features/boards/boardsSlice";
import {
  getLists,
  sortingLists,
  changeCards,
} from "../../features/lists/listsSlice";
import { getCards } from "../../features/card/cardsSlice";

import axios from "axios";

import useWindowHeight from "../../hooks/heightWindowHook";

import { Header } from "../blanks/Header";
import { List } from "./List";
import { CreateList } from "./CreateList";
import { CreateCard } from "./CreateCard";
import { ChangeNameList } from "./ChangeNameList";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { height } = useWindowHeight();

  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.boards);
  const { lists } = useSelector((state) => state.lists);
  const { cards } = useSelector((state) => state.cards);

  const [cardFormShow, setCardFormShow] = useState(false);

  const [listFormShow, setListFormShow] = useState(false);
  const [nameList, setNameList] = useState("");

  const [listId, setListId] = useState(null);

  const [xPos, setXPos] = useState(null);
  const [yPos, setYPos] = useState(null);

  const visibleCardCreate = (e) => {
    setListId(e.target.className);

    setXPos(e.target.getBoundingClientRect().x);
    setYPos(e.target.getBoundingClientRect().y);

    setCardFormShow(true);
  };

  const onNameListChange = (e) => {
    setNameList(e);
  };

  const visibleChangeNameList = (e, id) => {
    setListId(id);

    onNameListChange(e.target.innerText);

    setXPos(e.target.getBoundingClientRect().x);
    setYPos(e.target.getBoundingClientRect().y);

    setListFormShow(true);
  };

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

  return (
    <div className="boardMenu" style={{ height: height }}>
      <Header />
      <div className="lists" style={{ height: height - 127 }}>
        <div className="container">
          <div className="lists__inner" style={{ height: height - 127 }}>
            <div className="boardName">
              {boards.map((board) => (
                <div key={board._id}>
                  {board.nameBoard}
                  <input value={board.nameBoard} />
                </div>
              ))}
            </div>
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
                          visibleChangeNameList={visibleChangeNameList}
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
                listId={listId}
                boards={boards}
                moveForm={() => setYPos(yPos + 50)}
                formShow={cardFormShow}
                closeForm={() => setCardFormShow(false)}
              />

              {listId !== null ? (
                <ChangeNameList
                  xPos={xPos}
                  yPos={yPos}
                  nameList={nameList}
                  listId={listId}
                  changeNameList={onNameListChange}
                  listFormShow={listFormShow}
                  closeForm={() => setListFormShow(false)}
                />
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
