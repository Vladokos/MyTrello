import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignInFrom } from "./components/SignInFrom";
import { RegistrationForm } from "./components/RegistrationForm";
import { ForgotForm } from "./components/ForgotForm";
import { ResetForm } from "./components/ResetForm";
import { Boards } from "./components/Boards";

import "./styles/formStyles.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/sig" element={<SignInFrom />} />
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/forg" element={<ForgotForm />} />
          <Route path="/:id/reset/" element={<ResetForm />} />
          <Route path="/:id/boards" element={<Boards />} />
          <Route path="/" element={<Navigate replace to="/sig" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
