import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getBoards, addBoards } from "../features/boards/boardsSlice";

import axios from "axios";

import avatar from "../img/avatar.svg";

export const Boards = () => {
  const navigate = useNavigate();
  const params = useParams();

  const dispatch = useDispatch();
  const { boards, status } = useSelector((state) => state.boards);

  const [createVisibility, setCreateVisibility] = useState(false);
  const [nameBoard, setNameBoard] = useState("");

  const onNameBoardChange = (e) => setNameBoard(e.target.value);

  const visibleCreateMenu = () => setCreateVisibility(!createVisibility);
  const cancelCreateBoard = () => {
    setCreateVisibility(false);
    setNameBoard("");
  };

  const createBoard = () => {
    const { id } = params;

    if (nameBoard.length < 1) return;

    dispatch(addBoards({ id, nameBoard }));

    setCreateVisibility(false);
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { id } = params;

    if (refreshToken === "undefined" || refreshToken === null) navigate("/sig");

    axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/verify",
      data: {
        id,
        refreshToken: JSON.parse(refreshToken),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch(getBoards(id));
        }
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
      });
  }, []);

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <div className="logo">MyTrello</div>
            <div> recent </div>
            <div> favorites </div>
            <div> create button </div>
            <div className="account">
              <div className="account-avatar">
                <img src={avatar} />
              </div>
              <div className="account__Menu"></div>
            </div>
          </div>
        </div>
      </header>
      <div className="workspace">
        <div className="container">
          <div className="workspace__inner">
            <div className="boards">
              <ul>
                {boards.map((board) => (
                  <li className="board" key={board.nameBoard}>
                    <Link
                      to={"/board/" + board._id + "/" + board.nameBoard}
                      key={board._id}
                    >
                      {board.nameBoard}
                    </Link>
                  </li>
                ))}
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
            <button onClick={cancelCreateBoard}>X</button>
          </div>
        </div>
      </div>
    </div>
  );
};
