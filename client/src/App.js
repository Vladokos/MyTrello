import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignInFrom } from "./components/form/SignInFrom";
import { RegistrationForm } from "./components/form/RegistrationForm";
import { ForgotForm } from "./components/form/ForgotForm";
import { ResetForm } from "./components/form/ResetForm";

import { Boards } from "./components/Boards";
import { Board } from "./components/Board";

import { NotFound } from "./components/NotFound";

import "./styles/reset.css";
import "./styles/blanks.css";
import "./styles/formStyles.css";
import "./styles/menu.css";
import "./styles/board.css"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/sig" element={<SignInFrom />} />
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/forg" element={<ForgotForm />} />
          <Route path="/:token/reset/" element={<ResetForm />} />

          <Route path="/:id/boards" element={<Boards />} />
          <Route path="/board/:boardId/:name" element={<Board />} />

          <Route path="/error/:code" element={<NotFound />} />
          <Route path="/" element={<Navigate replace to="/sig" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
