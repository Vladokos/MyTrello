import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { List } from "./List";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import useWindowHeight from "../../hooks/heightWindowHook";
import OutsideClick from "../../hooks/outsideClick";

import CreateCard from "../portal/CreateCard";

import { useSelector, useDispatch } from "react-redux";
import { getBoard, changeLists } from "../../features/boards/boardsSlice";
import {
  getLists,
  addList,
  sortingLists,
  changeCards,
} from "../../features/lists/listsSlice";
import { getCards, addCard } from "../../features/card/cardsSlice";

import axios from "axios";

import avatar from "../../img/avatar.svg";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { height } = useWindowHeight();

  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.boards);
  const { lists } = useSelector((state) => state.lists);
  const { cards } = useSelector((state) => state.cards);

  const [profileShow, setProfileShow] = useState(false);
  const [boardFormShow, setBoardFromShow] = useState(false);
  const [listFormShow, setListFormShow] = useState(false);
  const [cardFormShow, setCardFormShow] = useState(false);

  const [nameList, setNameList] = useState("");
  const [nameCard, setNameCard] = useState("");
  const [listId, setListId] = useState("");

  const [xPosCardForm, setXPos] = useState(null);
  const [yPosCardForm, setYPos] = useState(null);

  const profileRef = useRef(null);
  const listInput = useRef(null);
  const listFormRef = useRef(null);
  const cardFormRef = useRef(null);
  const cardInput = useRef(null);

  const visibleProfileMenu = () => setProfileShow(!profileShow);
  const visibleCreateMenu = () => setBoardFromShow(!boardFormShow);
  const visibleListCreate = () => setListFormShow(!listFormShow);

  const closeModal = () => {
    setListFormShow(false);
    setCardFormShow(false);
    setProfileShow(false);
  };

  const visibleCardCreate = (e) => {
    setListId(e.target.className);

    setXPos(e.target.getBoundingClientRect().x);
    setYPos(e.target.getBoundingClientRect().y);

    setCardFormShow(true);
  };

  const onNameListChange = (e) => setNameList(e.target.value);
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

  const logOut = () => {
    sessionStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    navigate("/sig");
  };

  const createList = () => {
    if (nameList.replace(/ /g, "").length <= 0) {
      listInput.current.focus();
      return null;
    }

    const { boardId } = params;

    dispatch(addList({ nameList, boardId }));
    dispatch(getBoard(boardId));

    setNameList("");

    listInput.current.focus();
  };

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
        setYPos(yPosCardForm + 50);
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

  OutsideClick(listFormRef, closeModal);
  OutsideClick(profileRef, closeModal);
  OutsideClick(cardFormRef, closeModal);
  return (
    <div className="boardMenu" style={{ height: height }}>
      <header className="header header-board">
        <div className="container">
          <div className="header__inner">
            <div className="logo">MyTrello</div>
            <div> recent </div>
            <div> favorites </div>
            <div onClick={visibleCreateMenu}>Create</div>
            <div className="account">
              <div className="account-avatar" onClick={visibleProfileMenu}>
                <img src={avatar} />
              </div>
              <div
                className={profileShow === false ? "hidden" : "account__menu"}
                ref={profileRef}
              >
                <div className="account__menu-title">Account</div>
                <ul>
                  <li>
                    <Link to={"/" + params.id + "/profile"}>Profile</Link>
                  </li>
                  <li onClick={logOut}>Log out</li>
                </ul>
                <button onClick={visibleProfileMenu}>X</button>
              </div>
            </div>
          </div>
        </div>
      </header>
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
                          boardId={params.boardId}
                          visibleCardCreate={visibleCardCreate}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <li className="createList">
                <button
                  onClick={visibleListCreate}
                  className="createList-button"
                >
                  Add a list
                </button>
                <div
                  className={listFormShow === false ? "hidden" : "add-list"}
                  ref={listFormRef}
                >
                  <input
                    ref={listInput}
                    type="text"
                    placeholder="Enter list name"
                    value={nameList}
                    onChange={onNameListChange}
                  />
                  <button onClick={createList}>Add list</button>
                  <button onClick={visibleListCreate}>X</button>
                </div>
              </li>

              <CreateCard
                xPos={xPosCardForm}
                yPos={yPosCardForm}
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
