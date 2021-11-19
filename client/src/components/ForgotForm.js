import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setVisible] = useState(false);

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);

  const validate = (e) => {
    if (validateMail.test(e.target.value)) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (isVisible === false && email.length > 0) {
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
        },
      })
        .then((response) => {
          if (response.data === "OK") {
            // need add message "on your email sended link to restroe password"
          }
        })
        .catch((error) => {
          if (error.response.data === "Bad Request") {
            // Need add message "this email is not exist"
            console.log("error");
          }
        });
    }
  };

  return (
    <div className="form">
      <div className="container">
        <form className="forgetForm">
          <div className="title">Recover data</div>
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
          </div>
          <div className="sendform">
            <button onClick={sendForm}>Send data</button>
          </div>
          <div className="have Account">
            Back to
            <Link to="/sig"> SIGN IN </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
