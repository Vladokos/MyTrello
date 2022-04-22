import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignInFrom } from "./components/form/SignInFrom";
import { RegistrationForm } from "./components/form/RegistrationForm";
import { ForgotForm } from "./components/form/ForgotForm";
import { ResetForm } from "./components/form/ResetForm";

import { Boards } from "./components/Boards";
import { Board } from "./components/board/Board";

import { Profile } from "./components/profile/Profile";

import { NotFound } from "./components/NotFound";

import "./styles/reset.css";
import "./styles/blanks.css";
import "./styles/formStyles.css";
import "./styles/Boards.css";

function App({ socket }) {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/sig" element={<SignInFrom socket={socket} />} />
          <Route path="/reg" element={<RegistrationForm socket={socket} />} />
          <Route path="/forg" element={<ForgotForm socket={socket} />} />
          <Route
            path="/:token/reset/"
            element={<ResetForm socket={socket} />}
          />

          <Route
            path="/:userName/boards"
            element={<Boards socket={socket} />}
          />
          <Route path="/board/:boardId/:name" element={<Board />} />

          <Route path="/:userName/profile" element={<Profile />} />

          <Route path="/error/:code" element={<NotFound />} />
          <Route path="/" element={<Navigate replace to="/sig" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
