import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import OutsideClick from "../../hooks/OutsideClick";

import avatar from "../../img/avatar.svg";

import "../../styles/Header.css";
import { BurgerButton } from "./BurgerButton";

export const Header = ({ boards, createShow }) => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const [profileShow, setProfileShow] = useState(false);
  const [resentShow, setResentShow] = useState(false);
  const [favoritesShow, setFavoritesShow] = useState(false);

  const [menuShow, setMenuShow] = useState(false);

  const visibleProfileMenu = () => setProfileShow(true);

  const logOut = () => {
    sessionStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    navigate("/sig");
  };

  const profileRef = useRef(null);
  const recentRef = useRef(null);
  const favoritesRef = useRef(null);

  OutsideClick(profileRef, () => setProfileShow(false));
  OutsideClick(recentRef, () => setResentShow(false));
  OutsideClick(favoritesRef, () => setFavoritesShow(false));
  return (
    <header className="header header-board">
      <div className="container">
        <div className="header__inner">
          <div className="logo">
            <Link to={"/" + userId + "/boards"}>MyTrello</Link>
          </div>

          <BurgerButton Switch={() => setMenuShow(!menuShow)} switchState={menuShow} />
          <div className={menuShow == false ? "burgerMenu" : "burgerMenu open"}>
            <div
              className="recent"
              ref={recentRef}
              onClick={() => setResentShow(!resentShow)}
            >
              Recent
              <ul className={resentShow === true ? null : "hidden"}>
                <li>
                  Recent
                  <hr />
                </li>

                {[...boards]
                  .sort((a, b) => {
                    if (a.lastVisiting > b.lastVisiting) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((board, index) => {
                    if (index < 3) {
                      return (
                        <li key={board.nameBoard}>
                          <Link
                            to={"/board/" + board._id + "/" + board.nameBoard}
                            key={board._id}
                          >
                            {board.nameBoard}
                          </Link>
                        </li>
                      );
                    }
                  })}
              </ul>
            </div>
            <div
              className="favorites"
              ref={favoritesRef}
              onClick={() => setFavoritesShow(!favoritesShow)}
            >
              Favorites
              <ul className={favoritesShow === true ? null : "hidden"}>
                <li>
                  Favorites
                  <hr />
                </li>
                {boards.map((board) => {
                  if (board.favorites === true) {
                    return (
                      <li key={board.nameBoard}>
                        <Link
                          to={"/board/" + board._id + "/" + board.nameBoard}
                          key={board._id}
                        >
                          {board.nameBoard}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
            <div onClick={createShow}>Create</div>
          </div>
          <div className="account" ref={profileRef}>
            <div className="account-avatar" onClick={visibleProfileMenu}>
              <img src={avatar} />
            </div>
            <div className={profileShow === false ? "hidden" : "account__menu"}>
              <div className="account__menu-title">Account</div>
              <ul>
                <li>
                  <Link to={"/" + userName + "/profile"}>Profile</Link>
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
