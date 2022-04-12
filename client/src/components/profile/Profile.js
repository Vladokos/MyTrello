import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { Header } from "../blanks/Header";
import { CreateBoards } from "../CreateBoards";

import useWindowHeight from "../../hooks/heightWindowHook";

import "../../styles/profile/Profile.css";
import axios from "axios";

export const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { height } = useWindowHeight();

  const { boards } = useSelector((state) => state.boards);

  const [createShow, setCreateShow] = useState(false);
  const [heightBody, setHeightBody] = useState(null);
  const [name, setName] = useState(params.userName);

  const heightRef = useRef(null);

  useEffect(() => {
    setHeightBody(heightRef?.current?.clientHeight);
  });

  const changeName = () => {
    axios({
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
      />
    </div>
  );
};
