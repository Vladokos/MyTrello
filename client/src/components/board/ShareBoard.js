import React from "react";
import { useDispatch } from "react-redux";

import "../../styles/Board/ShareBoard.css";

export const ShareBoard = ({ height, back, close }) => {
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
          <input readOnly="readonly" />
        </li>
        <li>
          <button>Generate link</button>
        </li>
        <li>
          <button>Delete link</button>
        </li>
      </ul>
    </div>
  );
};
