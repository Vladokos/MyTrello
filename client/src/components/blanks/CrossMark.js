import React from "react";

import "../../styles/Marks.css";

export const CrossMark = ({dataExists, close, text}) => {

    return (
        <div className={!dataExists ? "notExist" : "exist"}>
        <svg
          className="checkmark"
          width="297"
          height="297"
          viewBox="0 0 297 297"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="Error">
            <circle
              className="Ellipse"
              cx="148.5"
              cy="148.5"
              r="143.5"
              strokeWidth="10"
            />
            <line
              className="Line1"
              x1="92.506"
              y1="88.0566"
              x2="209.506"
              y2="208.057"
              strokeWidth="7"
            />
            <line
              className="Line2"
              x1="209.506"
              y1="88.4434"
              x2="92.506"
              y2="208.443"
              strokeWidth="7"
            />
          </g>
        </svg>
        {text}
        <br />
        <button className="closePopup" onClick={close}>
          Close
        </button>
      </div>
    )
}