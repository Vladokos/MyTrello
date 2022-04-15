import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  getBoards,
  addFavorites,
  removeFavorites,
} from "../features/boards/boardsSlice";

import useWindowHeight from "../hooks/heightWindowHook";

import axios from "axios";

import { Loader } from "./blanks/Loader";
import { Header } from "./blanks/Header.js";
import { CreateBoards } from "./CreateBoards";

import starUnchecked from "../img/starUnchecked.svg";
import starChecked from "../img/starChecked.svg";

export const Boards = () => {
  const navigate = useNavigate();

  const { height } = useWindowHeight();

  const dispatch = useDispatch();
  const { boards, status } = useSelector((state) => state.boards);

  const [favoritesBoards, setFavorites] = useState(0);
  const [recent, setRecent] = useState(false);
  const [firstUpdate, setFirstUpdate] = useState(0);

  const [createShow, setCreateShow] = useState(false);
  const [heightBody, setHeightBody] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

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
        if (response.status === 200 && boards.length <= 1) {
          const { newToken, idUser, userName } = response.data;

          if (newToken) localStorage.setItem("accessToken", newToken);

          localStorage.setItem("userId", idUser);
          localStorage.setItem("userName", userName);

          dispatch(getBoards(idUser));
        }
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
      });
  }, []);

  useEffect(() => {
    if (boards.length > 0) {
      for (let i = 0; i < boards.length; i++) {
        if (boards[i].favorites === true) {
          setFavorites(+1);
        }
      }

      for (let i = 0; i < boards.length; i++) {
        if (boards[i].lastVisiting) {
          setRecent(+1);
        }
      }
    }
  }, [boards]);

  const favoriteAction = (favorite, boardId) => {
    switch (favorite) {
      case false:
        dispatch(addFavorites({ boardId }));

        break;
      case true:
        dispatch(removeFavorites({ boardId }));
        setFavorites(favoritesBoards - 1);
        break;
      default:
        break;
    }
  };

  const heightRef = useRef(null);

  useEffect(() => {
    setHeightBody(heightRef?.current?.clientHeight);
  });

  useLayoutEffect(() => {
    if (firstUpdate < 2) {
      setFirstUpdate(firstUpdate + 1);
      return;
    }
    const boardId = boards[boards.length - 1]._id;
    const boardName = boards[boards.length - 1].nameBoard;
    navigate("/board/" + boardId + "/" + boardName);
  }, [boards]);

  return status !== "succeeded" ? (
    <Loader />
  ) : (
    <div className="boardsMenu" style={{ minHeight: height }} ref={heightRef}>
      <Header boards={boards} createShow={() => setCreateShow(true)} />
      <div className="workspace">
        <div className="container">
          <div className="workspace__inner">
            <div className="boards">
              <ul className={recent > 0 ? null : "hidden"}>
                <li> Recent </li>
                {[...boards]
                  .sort((a, b) => {
                    if (a.lastVisiting > b.lastVisiting) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((board, index) => {
                    if (index < 3) {
                      return (
                        <li className="board" key={board.nameBoard}>
                          <Link
                            to={"/board/" + board._id + "/" + board.nameBoard}
                            key={board._id}
                          >
                            {board.nameBoard}
                          </Link>
                          <img
                            src={
                              board.favorites === false
                                ? starUnchecked
                                : starChecked
                            }
                            onClick={() =>
                              favoriteAction(board.favorites, board._id)
                            }
                          />
                        </li>
                      );
                    }
                  })}
              </ul>

              <ul className={favoritesBoards > 0 ? null : "hidden"}>
                <li> Favorites </li>
                {boards.map((board) => {
                  if (board.favorites === true) {
                    return (
                      <li className="board" key={board.nameBoard}>
                        <Link
                          to={"/board/" + board._id + "/" + board.nameBoard}
                          key={board._id}
                        >
                          {board.nameBoard}
                        </Link>
                        <img
                          src={
                            board.favorites === false
                              ? starUnchecked
                              : starChecked
                          }
                          onClick={() =>
                            favoriteAction(board.favorites, board._id)
                          }
                        />
                      </li>
                    );
                  }
                })}
              </ul>
              <ul>
                <li>All boards</li>
                {boards.map((board) => {
                  return (
                    <li className="board" key={board.nameBoard}>
                      <Link
                        to={"/board/" + board._id + "/" + board.nameBoard}
                        key={board._id}
                      >
                        {board.nameBoard}
                      </Link>
                      <img
                        src={
                          board.favorites === false
                            ? starUnchecked
                            : starChecked
                        }
                        onClick={() =>
                          favoriteAction(board.favorites, board._id)
                        }
                      />
                    </li>
                  );
                })}
                <li className="createBoards">
                  <button onClick={() => setCreateShow(true)}>
                    Create a new board
                  </button>
                </li>
              </ul>
            </div>
            <CreateBoards
              createShow={createShow}
              changeShow={() => setCreateShow(false)}
              height={heightBody}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
