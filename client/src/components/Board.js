import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getBoard } from "../features/boards/boardsSlice";

import axios from "axios";

import avatar from "../img/avatar.svg";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const dispatch = useDispatch();
  const { boards, status } = useSelector((state) => state.boards);

  const [profileVisibility, setProfileVisibility] = useState(false);
  const [createVisibility, setCreateVisibility] = useState(false);

  const [boardData, setBoardData] = useState();

  const visibleProfileMenu = () => setProfileVisibility(!profileVisibility);
  const visibleCreateMenu = () => setCreateVisibility(!createVisibility);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const { idBoard } = params;

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
        if (response.status === 200 && boards.length === 0) {
          dispatch(getBoard(idBoard));
        } else if (response.status === 200 && boards.length >= 1) {
          console.log(boards);
          const board = boards.filter((board) => {
            if (board._id === idBoard) {
              return board;
            }
          });
          console.log(board);
          setBoardData(board);
          console.log(boardData);
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

  return (
    <div>
      <header className="header">
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
                className={
                  profileVisibility === false ? "hidden" : "account__menu"
                }
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
      <div className="list">
        <div className="container">
          <div className="list__inner">
            <ul>
              <li>
                <button>Add list</button>
              </li>
            </ul>
            <div className="add-list">
              <input type="text" placeholder="Enter a task name" />
              <button>Add list</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
