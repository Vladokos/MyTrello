import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const RegistrationForm = () => {
  const [eMail, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(true);

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const validate = (e) => {
    if (validateMail.test(e.target.value)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (isVisible === true) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        method: "POST",
        url: "/reg",
        data: {
          email: eMail,
          name: name,
          password: password,
        },
      }).then((response) => {
        if (response.data === "OK") {
          // need redirect client to main page
        }
      });
    }
  };

  return (
    <div className="form">
      <div className="container">
        <form className="regForm">
          <div className="title">Sign Up</div>
          <div className="inputs">
            <input
              type="text"
              placeholder="E-mail"
              value={eMail}
              onChange={onEmailChange}
              onBlur={validate}
            />
            <span
              className={
                isVisible ? "inccorectMessage" : "inccorectMessage active"
              }
            >
              incorrect email
            </span>
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
      </div>
    </div>
  );
};
