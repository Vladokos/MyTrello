import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignInFrom } from "./components/SignInFrom";
import { RegistrationForm } from "./components/RegistrationForm";
import { ForgotForm } from "./components/ForgotForm";

import "./styles/formStyles.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/sig" element={<SignInFrom />} />
          <Route path="/reg" element={<RegistrationForm />} />
          <Route path="/forg" element={<ForgotForm />} />
          <Route path="/" element={<Navigate replace to="/sig" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
