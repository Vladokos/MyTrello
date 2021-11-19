import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const SignInFrom = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(false);
  const [isExists, setExists] = useState(false);

  const navigate = useNavigate();

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const validate = (e) => {
    if (validateMail.test(e.target.value)) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const closeWindow = (e) => {
    e.preventDefault();
    setExists(false);
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (isVisible === false && password.length > 6) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        method: "POST",
        url: "/sig",
        data: {
          email: email,
          password: password,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.statusText === "OK") {
            navigate("/" + response.data.user._id + "/boards");
          }
        })
        .catch((error) => {
          if (error.response.statusText === "Bad Request") {
            setExists(true);
          }
        });
    }
  };

  return (
    <div className="form">
      <div className="container">
        <form className="signFrom">
          <div className="title">Sign In</div>
          <div className="inputs">
            <div className="inccorectMail">
              <span
                className={
                  !isVisible ? "inccorectMessage" : "inccorectMessage active"
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
        <div className={!isExists ? "notExist" : "exist"}>
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
  );
};
