import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import uniqid from "uniqid";

import "../../styles/Board/ShareBoard.css";

let link = null;

export const ShareBoard = ({ height, back, close, socket, shareLink }) => {
  const params = useParams();

  link = shareLink;

  const generateLink = () => {
    const boardId = params.boardId;
    const boardName = params.name;

    link =  `http://localhost:3000/invite/b/${boardId}/${uniqid()}/${boardName}`;

    socket.emit("addLink", link, boardId);
  };



  useEffect(() => {
    socket.on("addLink", (data) => {
      if (data === "Added") {
        const boardId = params.boardId;
        socket.join(boardId);
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
