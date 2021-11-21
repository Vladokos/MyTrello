import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export const ResetForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/welcome",
      data: {
        token: params.token,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        const response = error.response;
        if (/4([0-9]+)/.test(response.status)) {
          navigate("/error/404")
        }
      });
  });

  const validate = (e) => {};

  const sendForm = (e) => {
    e.preventDefault();
  };

  return (
    <div className="form">
      <div className="container">
        <form className="forgetForm">
          <div className="title">Recover password</div>
          <div className="inputs">
            <input
              type="text"
              placeholder="New password"
              value={password}
              onChange={validate}
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
