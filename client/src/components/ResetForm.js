import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const ResetForm = () => {
  const [name, setName] = useState("");
  const [isVisible, setVisible] = useState(true);



  const validate = (e) => {
    
  };

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
              placeholder="Name"
              value={name}
            //   onChange={}
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
