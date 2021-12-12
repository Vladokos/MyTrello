import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export const ResetForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [dataExists, setDataExists] = useState(false);

  const onPasswordChange = (e) => setPassword(e.target.value);

  const closeWindow = (e) => {
    e.preventDefault();
    setDataExists(false);
  };

  useEffect(() => {
    axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/form/password/reset/token/validate",
      data: {
        token: params.token,
      },
    }).catch((error) => {
      const response = error.response;

      if (/4([0-9]+)/.test(response.status)) {
        navigate("/error/404");
      }
    });
  }, []);

  const sendForm = (e) => {
    e.preventDefault();

    if (password.length > 6) {
      axios({
        config: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
        method: "POST",
        url: "/form/password/reset",
        data: {
          token: params.token,
          password,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            navigate("/sig");
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
            <div className="title">Recover password</div>
            <div className="inputs">
              <input
                type="text"
                placeholder="New password"
                value={password}
                onChange={onPasswordChange}
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
            Please use a password different from the old one
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
