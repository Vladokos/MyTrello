import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { CrossMark } from "../blanks/CrossMark";

export const RegistrationForm = ({ socket, height }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [dataExists, setDataExists] = useState(false);

  const navigate = useNavigate();

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);
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

        socket.off("oldUser");

        navigate("/" + userName + "/boards");
      }
    });
    socket.on("registration", (data) => {
      if (data !== "Exist") {

        const { userName, refreshToken, accessToken } = data;


        localStorage.setItem("accessToken", JSON.stringify(accessToken));

        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

        localStorage.setItem("userName", JSON.stringify(userName));

        socket.off("registration");

        navigate("/" + userName + "/boards");
      } else if (data === "Exist") {
        setDataExists(true);
      }
    });
  }, [socket]);

  const sendForm = (e) => {
    e.preventDefault();
    if (incorrect === false && name.length > 0 && password.length >= 6) {
      socket.emit("registration", email, name, password);
    }
  };

  return (
    <div className="form">
      <div className="container">
      <div className="form__inner" style={{'height': height}}>
          <form className="regForm">
            <div className="title">Sign Up</div>
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
                placeholder="Username"
                value={name}
                onChange={onNameChange}
              />
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={onPasswordChange}
              />
            </div>
            <div className="sendform">
              <button onClick={sendForm}>SIGN UP</button>
            </div>
            <div className="have Account">
              Already have an account?
              <Link to="/sig"> LOGIN IN </Link>
            </div>
          </form>
          <CrossMark
            dataExists={dataExists}
            close={closeWindow}
            text={"Check right your email address and password"}
          />
        </div>
      </div>
    </div>
  );
};
