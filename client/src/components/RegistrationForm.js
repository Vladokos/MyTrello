import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const RegistrationForm = () => {
  const [eMail, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(false);
  const [isExists, setExists] = useState(false);

  const navigate = useNavigate();
  
  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);
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
    if (isVisible === false && name.length > 0 && password.length > 6) {
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
        switch (response.data) {
          case "OK":
            navigate("/boards");
            break;
          case "Exists":
            setExists(true);
            break;
          default:
            break;
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
          A user with this mail already exists
          <br />
          <button className="closePopup" onClick={closeWindow}>
            Close
          </button>
        </div>
      </div>
      {/* <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.16 11.51L6.83999 51.9C6.65448 52.2233 6.55707 52.5897 6.5575 52.9625C6.55792 53.3352 6.65617 53.7013 6.84242 54.0243C7.02868 54.3472 7.29641 54.6155 7.61887 54.8025C7.94133 54.9896 8.30722 55.0887 8.67999 55.09H55.32C55.6928 55.0887 56.0587 54.9896 56.3811 54.8025C56.7036 54.6155 56.9713 54.3472 57.1576 54.0243C57.3438 53.7013 57.4421 53.3352 57.4425 52.9625C57.4429 52.5897 57.3455 52.2233 57.16 51.9L33.84 11.51C33.6524 11.1884 33.3838 10.9215 33.061 10.736C32.7381 10.5506 32.3723 10.453 32 10.453C31.6277 10.453 31.2618 10.5506 30.939 10.736C30.6161 10.9215 30.3476 11.1884 30.16 11.51V11.51Z"
          fill="#EFCC00"
        />
        <path
          d="M29 46C29 45.4067 29.1759 44.8266 29.5056 44.3333C29.8352 43.8399 30.3038 43.4554 30.8519 43.2284C31.4001 43.0013 32.0033 42.9419 32.5853 43.0576C33.1672 43.1734 33.7017 43.4591 34.1213 43.8787C34.5409 44.2982 34.8266 44.8328 34.9423 45.4147C35.0581 45.9967 34.9987 46.5999 34.7716 47.148C34.5446 47.6962 34.16 48.1648 33.6667 48.4944C33.1733 48.824 32.5933 49 32 49C31.6015 49.017 31.2038 48.951 30.8321 48.8062C30.4605 48.6615 30.1229 48.4411 29.8409 48.1591C29.5589 47.877 29.3385 47.5395 29.1937 47.1678C29.049 46.7962 28.983 46.3985 29 46ZM30.09 41.34L29.33 26.34H34.59L33.86 41.34H30.09Z"
          fill="#353535"
        />
      </svg> */}
    </div>
  );
};
