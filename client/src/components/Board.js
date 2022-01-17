import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import useWindowHeight from "../hooks/heightWindowHook";
import OutsideClick from "../hooks/outsideClick";

import CreateCard from "./portal/CreateCard";

import { useSelector, useDispatch } from "react-redux";
import { getBoard, changeLists } from "../features/boards/boardsSlice";
import {
  getLists,
  addList,
  sortingLists,
  changeCards,
} from "../features/lists/listsSlice";
import { getCards, addCard } from "../features/card/cardsSlice";

import axios from "axios";

import avatar from "../img/avatar.svg";

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

  const [nameList, setNameList] = useState("");
  const [nameCard, setNameCard] = useState("");

  const [listId, setListId] = useState("");

  const [cardFormShow, setCardFormShow] = useState(false);
  const [xPosCardForm, setXPos] = useState(null);
  const [yPosCardForm, setYPos] = useState(null);

  const profileRef = useRef(null);
  const listInput = useRef(null);
  const listFormRef = useRef(null);
  const cardFormRef = useRef(null);
  const cardInput = useRef(null);

  const [currentList, setCurrentList] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);

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
    if (nameList.replace(/ /g, "").length <= 0 || !listId) {
      cardInput.current.focus();
      return null;
    }

    const { boardId } = params;

    // when the card was render(added on the state in redux)
    //  then the popup moves down
    dispatch(addCard({ nameCard, boardId, listId })).then(() => {
      dispatch(getLists(boardId));
      setYPos(yPosCardForm + 50);
    });

    setNameCard("");

    cardInput.current.focus();
  };

  const dragStart = (list, card) => {
    setCurrentList(list);
    if (card) {
      setCurrentCard(card);
    }
  };

  const drop = (list, card) => {
    const fromListId = currentList._id;
    const toListId = list._id;
    const position = lists[lists.indexOf(list)].cards.indexOf(card._id);
    const cardId = currentCard._id;

    dispatch(changeCards({ fromListId, toListId, position, cardId }));
  };

  const onDropCardHandler = (list) => {
    if (currentCard === null) {
      const currentListId = currentList._id;
      const position = boards[0].lists.indexOf(list._id);
      const boardId = boards[0]._id;

      dispatch(changeLists({ position, boardId, currentListId }));
      // make a check for drop a card on a board
      // also make a check for drop a card under an another card
    } else if (list.cards.length === 0) {
      const fromListId = currentList._id;
      const toListId = list._id;
      const position = 0;
      const cardId = currentCard._id;

      dispatch(changeCards({ fromListId, toListId, position, cardId }));
    }

    setCurrentList(null);
    setCurrentCard(null);
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
      <div className="lists">
        <div className="container">
          <div className="lists__inner">
            <ul>
              {lists.map((list) => {
                if (list.boardId === params.boardId) {
                  return (
                    <li
                      key={list._id}
                      className={"list " + list.nameList}
                      onDragStart={() => dragStart(list, null)}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={() => onDropCardHandler(list)}
                      draggable={true}
                    >
                      {list.nameList}

                      <ul className="cards">
                        {list.cards.map((cardId) => {
                          return cards.map((card) => {
                            if (cardId === card._id) {
                              return (
                                <li
                                  onDragStart={() => dragStart(list, card)}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                  }}
                                  onDragEnd={(e) => {
                                    e.preventDefault();
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                  }}
                                  onDrop={() => drop(list, card)}
                                  draggable={true}
                                  key={card._id}
                                  className="card"
                                >
                                  {card.nameCard}
                                </li>
                              );
                            }
                          });
                        })}
                      </ul>
                      <button onClick={visibleCardCreate} className={list._id}>
                        Add a card
                      </button>
                    </li>
                  );
                }
              })}
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
