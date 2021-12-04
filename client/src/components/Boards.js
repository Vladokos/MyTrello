import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

import avatar from "../img/avatar.svg";

export const Boards = () => {
  const navigate = useNavigate();
  const params = useParams();

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
        id: id,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/error/404");
        }
        console.log(error.response);
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
    </div>
  );
};
