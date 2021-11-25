import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="notFound">
      <div className="container">
        <div className="notFound__inner">
          <h1> 404 </h1>
          <div>Page Not Found</div>
          <div className="notFound-exit">
            <Link to="/sig"> GO BACK </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
