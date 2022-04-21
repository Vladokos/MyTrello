import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io();

export const SignInFrom = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [dataExists, setDataExists] = useState(false);

  const navigate = useNavigate();

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const validate = (e) => {
    if (validateMail.test(e.target.value)) {
      setIncorrect(false);
    } else {
      setIncorrect(true);
    }
  };

  const closeWindow = (e) => {
    e.preventDefault();
    setDataExists(false);
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(socket.emit("oldUser", JSON.parse(refreshToken)));

    if (refreshToken !== "undefined" && refreshToken !== null) {
      socket.emit("oldUser", JSON.parse(refreshToken));
    }
  }, []);

  useEffect(() => {
    socket.on("oldUser", (data) => {
      if (data !== "Error") {
        const { userName, refreshToken, accessToken } = data;

        localStorage.setItem("accessToken", JSON.stringify(accessToken));

        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        localStorage.setItem("userName", JSON.stringify(userName));

        // navigate("/" + userName + "/boards");
      }
    });

    socket.on("signIn", (data) => {
      if (data !== "Error") {
        const { userName, refreshToken, accessToken } = data;

        localStorage.setItem("accessToken", JSON.stringify(accessToken));

        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        localStorage.setItem("userName", JSON.stringify(userName));

        // navigate("/" + userName + "/boards");
      } else {
        setDataExists(true);
      }
    });

   
  }, [socket]);

  const sendForm = (e) => {
    e.preventDefault();

    if (incorrect === false && password.length >= 6)
      socket.emit("signIn", email, password);
  };

  return (
    <div className="form">
      <div className="container">
        <div className="form__inner">
          <form className="signFrom">
            <div className="title">Sign In</div>
            <div className="inputs">
              <div className="incorrectMail">
                <span
                  className={
                    !incorrect ? "incorrectMessage" : "incorrectMessage active"
                  }
                >
                  incorrect email
                </span>
              </div>
              <input
                type="text"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={onEmailChange}
                onBlur={validate}
              />
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={onPasswordChange}
              />
            </div>
            <div className="forgot">
              Forgot: <Link to="/forg"> Username / Password? </Link>
            </div>
            <div className="sendform">
              <button onClick={sendForm}>SIGN IN</button>
            </div>
            <div className="no Account">
              Don’t have an account?
              <Link to="/reg"> SIGN UP NOW </Link>
            </div>
          </form>
          <div className={!dataExists ? "notExist" : "exist"}>
            <svg
              className="checkmark"
              width="297"
              height="297"
              viewBox="0 0 297 297"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="Error">
                <circle
                  className="Ellipse"
                  cx="148.5"
                  cy="148.5"
                  r="143.5"
                  strokeWidth="10"
                />
                <line
                  className="Line1"
                  x1="92.506"
                  y1="88.0566"
                  x2="209.506"
                  y2="208.057"
                  strokeWidth="7"
                />
                <line
                  className="Line2"
                  x1="209.506"
                  y1="88.4434"
                  x2="92.506"
                  y2="208.443"
                  strokeWidth="7"
                />
              </g>
            </svg>
            Check right your email address and password
            <br />
            <button className="closePopup" onClick={closeWindow}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
