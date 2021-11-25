import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [dataExists, setDataExists] = useState(false);
  const [successfully, setSuccessfully] = useState(false);

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);

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
    setSuccessfully(false);
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (incorrect === false && email.length > 0) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        method: "POST",
        url: "/forg",
        data: {
          email: email,
          name: name,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setSuccessfully(true);
          }
        })
        .catch((error) => {
          const response = error.response;

          if (response.status === 400) {
            setDataExists(true);
          }
        });
    }
  };

  return (
    <div className="form">
      <div className="container">
        <div className="form__inner">
          <form className="forgetForm">
            <div className="title">Recover data</div>
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
            </div>
            <div className="sendform">
              <button onClick={sendForm}>Send data</button>
            </div>
            <div className="have Account">
              Back to
              <Link to="/sig"> SIGN IN </Link>
            </div>
          </form>
          <div className={!dataExists ? "notExist" : "exist forgot"}>
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
            A user with this email address or name does not exist
            <br />
            <button className="closePopup" onClick={closeWindow}>
              Close
            </button>
          </div>
          <div className={successfully ? "successfully" : "unsuccessful"}>
            <svg
              className="check"
              width="297"
              height="297"
              viewBox="0 0 297 297"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="done">
                <circle
                  className="StokeRound"
                  cx="148.5"
                  cy="148.5"
                  r="143.5"
                  strokeWidth="10"
                />
                <path
                  className="SmallLine"
                  d="M66 142.565L134.634 200.069"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <line
                  className="BigLine"
                  x1="231.493"
                  y1="84.9316"
                  x2="135.001"
                  y2="199.576"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            Check your email, we sent you a link to reset your password
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
