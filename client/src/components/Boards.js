import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  getBoards,
  addBoards,
  addFavorites,
  removeFavorites,
} from "../features/boards/boardsSlice";

import useWindowHeight from "../hooks/heightWindowHook";

import axios from "axios";

import { Loader } from "./blanks/Loader";
import { Header } from "./blanks/Header.js";

import starUnchecked from "../img/starUnchecked.svg";
import starChecked from "../img/starChecked.svg";

export const Boards = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { height } = useWindowHeight();

  localStorage.setItem("userId", params.id);

  const dispatch = useDispatch();
  const { boards, status } = useSelector((state) => state.boards);

  const [createVisibility, setCreateVisibility] = useState(false);
  const [nameBoard, setNameBoard] = useState("");

  const visibleCreateMenu = () => setCreateVisibility(!createVisibility);

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const { id } = params;

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
          dispatch(getBoards(id));
        }
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
      });
  }, []);

  const createBoard = () => {
    const { id } = params;

    if (nameBoard.trim().length < 1) return;

    dispatch(addBoards({ id, nameBoard }));

    setNameBoard("");

    setCreateVisibility(false);
  };

  const favoriteAction = (favorite, boardId) => {
    switch (favorite) {
      case false:
        dispatch(addFavorites({ boardId }));
        break;
      case true:
        dispatch(removeFavorites({ boardId }));
        break;
      default:
        break;
    }
  };

  return status !== "succeeded" ? (
    <Loader />
  ) : (
    <div className="boardsMenu" style={{ height: height }}>
      <Header />
      <div className="workspace">
        <div className="container">
          <div className="workspace__inner">
            <div className="boards">
              <ul>
                {[...boards]
                  .sort((a, b) => {
                    if (a.lastVisiting > b.lastVisiting) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((board) => {
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
              </ul>
              <ul>
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
                  <button onClick={visibleCreateMenu}>
                    Create a new board
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className={createVisibility === false ? "hidden" : "menuCreateBoard"}
      >
        <div className="blackBG" onClick={visibleCreateMenu}></div>
        <div className="container">
          <div className="menuCreateBoard__inner">
            <div className="settingsBoard">
              <input
                type="text"
                placeholder="Add a board name"
                value={nameBoard}
                onChange={onNameBoardChange}
              />
            </div>

            <button
              onClick={createBoard}
              className={nameBoard.length > 0 ? "activeCreate" : ""}
            >
              Create
            </button>
            <button onClick={visibleCreateMenu}>X</button>
          </div>
        </div>
      </div>
    </div>
  );
};
