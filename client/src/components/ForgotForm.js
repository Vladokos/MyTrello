import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotForm = () => {
  const [eMail, setEmail] = useState("");
  const [isVisible, setVisible] = useState(true);

  const onEmailChange = (e) => setEmail(e.target.value);

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
        <form className="forgetForm">
          <div className="title">Recover data</div>
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
          </div>
          <div className="sendform">
            <button>Send data</button>
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
