import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const RegistrationForm = () => {
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

    if (refreshToken !== "undefined") {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        method: "POST",
        url: "/reg/oldUser",
        data: {
          refreshToken: JSON.parse(refreshToken),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const { id, refreshToken } = response.data;

            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

            navigate("/" + id + "/boards");
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  const sendForm = (e) => {
    e.preventDefault();
    if (incorrect === false && name.length > 0 && password.length >= 6) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        method: "POST",
        url: "/reg",
        data: {
          email: email,
          name: name,
          password: password,
        },
      })
        .then((response) => {
          if (response.status === 201) {
            const { id, refreshToken } = response.data;

            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
            navigate("/" + id + "/boards");
          }
        })
        .catch((error) => {
          console.log(error);
          const response = error.response;

          if (response.status === 409) {
            setDataExists(true);
          }
        });
    }
  };

  return (
    <div className="form">
      <div className="container">
        <div className="form__inner">
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
            {/* <div className="rememberUser">
              <input type="checkbox" />
              remember me
            </div> */}
            <div className="sendform">
              <button onClick={sendForm}>SIGN UP</button>
            </div>
            <div className="have Account">
              Already have an account?
              <Link to="/sig"> LOGIN IN </Link>
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
            A user with this mail already exists
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
