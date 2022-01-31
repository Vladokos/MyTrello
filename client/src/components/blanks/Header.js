import React, { useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import OutsideClick from "../../hooks/outsideClick";

import avatar from "../../img/avatar.svg";

export const Header = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [createShow, setCreateShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);

  const visibleCreateMenu = () => setCreateShow(!createShow);
  const visibleProfileMenu = () => setProfileShow(!profileShow);

  const logOut = () => {
    sessionStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    navigate("/sig");
  };

  const profileRef = useRef(null);
  OutsideClick(profileRef, () => setProfileShow(false));
  return (
    <header className="header header-board">
      <div className="container">
        <div className="header__inner">
          <div className="logo">MyTrello</div>
          <div> recent </div>
          <div> favorites </div>
          <div onClick={visibleCreateMenu}>Create</div>
          <div className="account">
            <div className="account-avatar" onClick={visibleProfileMenu}>
              <img src={avatar} />
            </div>
            <div
              className={profileShow === false ? "hidden" : "account__menu"}
              ref={profileRef}
            >
              <div className="account__menu-title">Account</div>
              <ul>
                <li>
                  <Link to={"/" + params.id + "/profile"}>Profile</Link>
                </li>
                <li onClick={logOut}>Log out</li>
              </ul>
              <button onClick={visibleProfileMenu}>X</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
