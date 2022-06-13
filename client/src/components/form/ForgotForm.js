import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CrossMark } from "../blanks/CrossMark";
import { CorrectMark } from "../blanks/CorrectMark";

export const ForgotForm = ({ socket, height }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [dataExists, setDataExists] = useState(false);
  const [successfully, setSuccessfully] = useState(false);

  const validateMail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onEmailChange = (e) => setEmail(e.target.value);
  const onNameChange = (e) => setName(e.target.value);

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
    setSuccessfully(false);
  };

  const sendForm = (e) => {
    e.preventDefault();
    if (incorrect === false && email.length > 0) {
      socket.emit("forgot", email, name);
    }
  };

  useEffect(() => {
    socket.on("forgot", (data) => {
      if (data === "Success") {
        setSuccessfully(true);
        socket.off("forgot");
      } else {
        setDataExists(true);
      }
    });
  }, [socket]);

  return (
    <div className="form">
      <div className="container">
      <div className="form__inner" style={{'height': height}}>
          <form className="forgetForm">
            <div className="title">Recover data</div>
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
            text={" A user with this email address or name does not exist"}
          />
          <CorrectMark successfully={successfully} close={closeWindow} />
        </div>
      </div>
    </div>
  );
};
