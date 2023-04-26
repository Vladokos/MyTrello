import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";

import { io } from "socket.io-client";

const socket = io(`https://mytrello-backend.onrender.com`);
// const socket = io(`http://localhost:3000/`);
socket.on("connect", () => {
  console.log(socket.id);
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),

);
