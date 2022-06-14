import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignInFrom } from "./components/form/SignInFrom";
import { RegistrationForm } from "./components/form/RegistrationForm";
import { ForgotForm } from "./components/form/ForgotForm";
import { ResetForm } from "./components/form/ResetForm";

import { Boards } from "./components/Boards";
import { Board } from "./components/board/Board";

import { ValidateInvite } from "./components/ValidateInvite";

import { Profile } from "./components/profile/Profile";

import { NotFound } from "./components/NotFound";

import "./styles/reset.css";
import "./styles/blanks.css";
import "./styles/formStyles.css";
import "./styles/Boards.css";

import useWindowHeight from "./hooks/heightWindowHook";
function App({ socket }) {
  const { height } = useWindowHeight();

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/sig"
            element={<SignInFrom socket={socket} height={height} />}
          />
          <Route
            path="/reg"
            element={<RegistrationForm socket={socket} height={height} />}
          />
          <Route
            path="/forg"
            element={<ForgotForm socket={socket} height={height} />}
          />
          <Route
            path="/:token/reset/"
            element={<ResetForm socket={socket} height={height} />}
          />

          <Route
            path="/:userName/boards"
            element={<Boards socket={socket} height={height}/>}
          />
          <Route
            path="/board/:boardId/:name"
            element={<Board socket={socket} />}
          />
          <Route
            path="invite/b/:boardId/:uniqId/:name"
            element={<ValidateInvite socket={socket} />}
          />

          <Route
            path="/:userName/profile"
            element={<Profile socket={socket} />}
          />

          <Route path="/error/:code" element={<NotFound />} />

          <Route path="/" element={<Navigate replace to="/sig" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
