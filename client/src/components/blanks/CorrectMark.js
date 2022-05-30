import React from "react";

import "../../styles/Marks.css";

export const CorrectMark = ({successfully, close}) => {

    return (
        <div className={successfully ? "successfully" : "unsuccessful"}>
        <svg
          className="check"
          width="297"
          height="297"
          viewBox="0 0 297 297"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="done">
            <circle
              className="StokeRound"
              cx="148.5"
              cy="148.5"
              r="143.5"
              strokeWidth="10"
            />
            <path
              className="SmallLine"
              d="M66 142.565L134.634 200.069"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <line
              className="BigLine"
              x1="231.493"
              y1="84.9316"
              x2="135.001"
              y2="199.576"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </svg>
        Check your email, we sent you a link to reset your password
        <br />
        <button className="closePopup" onClick={close}>
          Close
        </button>
      </div>
    )
}