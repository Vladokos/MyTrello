import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SignInFrom = () => {
  const [eMail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(true);

  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const validate = (e) => {
    if (validateMail.test(e.target.value)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  return (
    <div className="form">
      <div className="container">
        <form className="signFrom">
          <div className="title">Sign In</div>
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
              placeholder="Password"
              value={password}
              onChange={onPasswordChange}
            />
          </div>
          <div className="forgot">
            Forgot: <Link to="/forg"> Username / Password? </Link>
          </div>
          <div className="sendform">
            <button>SIGN IN</button>
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
