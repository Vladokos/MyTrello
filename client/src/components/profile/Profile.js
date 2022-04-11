import React, { useState, useEffect, useLayoutEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { Header } from "../blanks/Header";

export const Profile = () => {
  const { boards } = useSelector((state) => state.boards);

  const [createShow, setCreateShow] = useState(false);
  return (
    <div>
      <Header boards={boards} createShow={() => setCreateShow(true)} />
      <div>
        <div className="container">
          <div>
            <div>Hello name</div>
            <div>
              User name
              <input />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
