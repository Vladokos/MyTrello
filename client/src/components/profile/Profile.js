import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getBoards } from "../../features/boards/boardsSlice";

import { Header } from "../blanks/Header";
import { CreateBoards } from "../CreateBoards";

import useWindowHeight from "../../hooks/heightWindowHook";

import {axiosInstance} from "../../config";

import "../../styles/profile/Profile.css";

export const Profile = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const navigate = useNavigate();

  const { height } = useWindowHeight();

  const { boards } = useSelector((state) => state.boards);

  const [createShow, setCreateShow] = useState(false);
  const [heightBody, setHeightBody] = useState(null);
  const [name, setName] = useState(params.userName);

  const [firstUpdate, setFirstUpdate] = useState(0);

  const heightRef = useRef(null);

  useEffect(() => {
    const idUser = localStorage.getItem("userId");

    dispatch(getBoards(idUser));
  }, []);

  useEffect(() => {
    setHeightBody(heightRef?.current?.clientHeight);
  });

  const changeName = () => {
    axiosInstance({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/user/change/name",
      data: {
        userName: name,
        oldName: params.userName,
      },
    }).then((response) => {
      if (response.status === 200) {
        localStorage.setItem("userName", response.data.userName);

        navigate("../" + response.data.userName + "/profile");
      }
    });
  };

  // useLayoutEffect(() => {
  //   if (firstUpdate < 2) {
  //     setFirstUpdate(firstUpdate + 1);
  //     return;
  //   }
  //   const boardId = boards[boards.length - 1]._id;
  //   const boardName = boards[boards.length - 1].nameBoard;
  //   navigate("/board/" + boardId + "/" + boardName);
  // }, [boards]);



  return (
    <div className="profile" style={{ minHeight: height }} ref={heightRef}>
      <Header boards={boards} createShow={() => setCreateShow(true)} />
      <div className="container">
        <div className="profile__inner">
          <div>Hello {params.userName}</div>
          <div>
            User name
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={changeName}>Save</button>
          </div>
        </div>
      </div>

      <CreateBoards
        createShow={createShow}
        changeShow={() => setCreateShow(false)}
        height={heightBody}
        boards={boards}
      />
    </div>
  );
};
