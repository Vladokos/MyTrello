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

  const createBoard = () => {
    const { id } = params;

    if (nameBoard.length < 1) return;

    dispatch(addBoards({ id, nameBoard }));

    setCreateVisibility(false);
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const { id } = params;

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
        id,
        accessToken: JSON.parse(accessToken),
      },
    })
      .then((response) => {
        if (response.status === 200 && boards.length === 0) {
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
    <div className="boardsMenu">
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <div className="logo">MyTrello</div>
            <div> recent </div>
            <div> favorites </div>
            <div onClick={visibleCreateMenu}>Create</div>
            <div className="account">
              <div className="account-avatar">
                <img src={avatar} />
              </div>
              <div className="account__menu">
                <div className="account__menu-title">
                  Account
                </div>
                <ul>
                  <li>Profile</li>
                  <li>Log out</li>
                </ul>
              </div>
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
