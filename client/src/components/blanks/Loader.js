import React from "react";

import "../../styles/Loader.css";

export const Loader = () => {
  return (
    <div className="loadScreen">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
