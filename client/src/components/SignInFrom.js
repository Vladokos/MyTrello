import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const SignInFrom = () => {
  const [eMail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(false);

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

  const sendForm = (e) => {
    e.preventDefault();
    if (isVisible === false && password.length > 6) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        method: "POST",
        url: "/sig",
        data: {
          email: eMail,
          password: password,
        },
      })
        .then((response) => {
          if (response.data === "OK") {
            navigate("/boards");
          }
        })
        .catch((error) => {
          if (error.response.data === "Bad Request") {
            // Need add a message let client know his email or password incorrect
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
              value={eMail}
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
      </div>
    </div>
  );
};
