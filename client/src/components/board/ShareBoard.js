import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import uniqid from "uniqid";

import "../../styles/Board/ShareBoard.css";

export const ShareBoard = ({ height, back, close, socket, shareLink }) => {
  const params = useParams();

  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(shareLink);
  }, []);

  const generateLink = () => {
    const boardId = params.boardId;
    const boardName = params.name;

    const newLink = `https://mytrello-backend.onrender.com/invite/b/${boardId}/${uniqid()}/${boardName}`;
    // const newLink = `http://localhost:3000/invite/b/${boardId}/${uniqid()}/${boardName}`;
    setLink(newLink);
    socket.emit("addLink", newLink, boardId);
    socket.emit("bond", {
      roomId: boardId,
      message: "disconnect",
    });
  };

  useEffect(() => {
    socket.on("addLink", (data) => {
      if (data === "Added") {
        const roomId = params.boardId;

        socket.emit("room", roomId);
      }
    });
  }, [socket]);

  return (
    <div className="share" style={{ height: height - 90 }}>
      <div className="shareTitle">
        <button onClick={back}>&#60;</button>
        Share board
        <button onClick={close}>X</button>
      </div>
      <hr />
      <ul className="sharedMenu">
        <li>
          <input readOnly="readonly" value={link} />
        </li>
        <li>
          <button onClick={generateLink}>Generate link</button>
        </li>
        <li>
          <button>Delete link</button>
        </li>
      </ul>
    </div>
  );
};
