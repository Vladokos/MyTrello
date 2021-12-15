import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import  useWindowHeight  from "../hooks/heightWindowHook";

import { useSelector, useDispatch } from "react-redux";
import { getBoard } from "../features/boards/boardsSlice";
import { getLists, addList } from "../features/lists/listsSlice";


import axios from "axios";

import avatar from "../img/avatar.svg";

export const Board = () => {
  const navigate = useNavigate();
  const params = useParams();

  const {height} = useWindowHeight();
  console.log(height);
  const dispatch = useDispatch();
  const { boards, status } = useSelector((state) => state.boards);
  const { lists } = useSelector((state) => state.lists);

  const [profileVisibility, setProfileVisibility] = useState(false);
  const [createVisibility, setCreateVisibility] = useState(false);
  const [listCreateVisibility, setListCreateVisibility] = useState(false);

  const [boardData, setBoardData] = useState();
  const [nameList, setNameList] = useState("");

  const visibleProfileMenu = () => setProfileVisibility(!profileVisibility);
  const visibleCreateMenu = () => setCreateVisibility(!createVisibility);
  const visibleListCreate = () =>
    setListCreateVisibility(!listCreateVisibility);

  const onNameListChange = (e) => setNameList(e.target.value);

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
          dispatch(getBoard(idBoard)).then((res) => setBoardData(res.payload));
          dispatch(getLists(idBoard));
        } else if (response.status === 200 && boards.length >= 1) {
          const board = boards.filter((board) => {
            if (board._id === idBoard) {
              return board;
            }
          });
          setBoardData(board);

          if (lists.length === 0) dispatch(getLists(idBoard));
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
    const { idUser } = boardData[0];
    const idBoard = boardData[0]._id;

    dispatch(addList({ nameList, idUser, idBoard }));
  };

  return (
    <div className="boardMenu" style={{ height: height }}>
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
              {lists.map((list) => (
                <li key={list.nameList}>{list.nameList}</li>
              ))}
              <li>
                <button onClick={visibleListCreate}>Add list</button>
                <div
                  className={
                    listCreateVisibility === false ? "hidden" : "add-list"
                  }
                >
                  <input
                    type="text"
                    placeholder="Enter a list name"
                    value={nameList}
                    onChange={onNameListChange}
                  />
                  <button onClick={createList}>Add list</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
