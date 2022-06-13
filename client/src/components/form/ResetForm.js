import React, { useState, useEffect } from "react";

import { Link, useParams, useNavigate } from "react-router-dom";

import { CrossMark } from "../blanks/CrossMark";

export const ResetForm = ({ socket, height }) => {
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
    const token = params.token;
    socket.emit("tokenValidate", token);
  }, []);

  useEffect(() => {
    socket.on("tokenValidate", (data) => {
      if (data !== "Valid") {
        socket.off("tokenValidate");

        navigate("/error/404");
      }
    });
    socket.on("passwordReset", (data) => {
      if (data === "Success") {
        socket.off("passwordReset");

        navigate("/sig");
      } else {
        setDataExists(true);
      }
    });
  }, [socket]);

  const sendForm = (e) => {
    e.preventDefault();

    if (password.length > 6) {
      const token = params.token;

      socket.emit("passwordReset", token, password);
    }
  };

  return (
    <div className="form">
      <div className="container">
      <div className="form__inner" style={{'height': height}}>
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
          <CrossMark
            dataExists={dataExists}
            close={closeWindow}
            text={"Please use a password different from the old one"}
          />
        </div>
      </div>
    </div>
  );
};
