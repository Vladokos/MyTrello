import React, { useState, useRef } from "react";

import { ArchiveList } from "./ArchiveList";
import { ArchiveCard } from "./ArchiveCard";
import { ShareBoard } from "./ShareBoard";

import OutsideClick from "../../hooks/outsideClick";

import archive from "../../img/archive.svg";
import link from "../../img/makeLink.svg";

import "../../styles/Board/Menu.css";

export const Menu = ({ height, lists, cards }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiveListOpen, setArchiveListOpen] = useState(false);
  const [archiveCardOpen, setArchiveCardOpen] = useState(false);
  const [shareBoard, setShareBoard] = useState(false);

  const menu = useRef(null);
  OutsideClick(menu, () => setMenuOpen(false));
  return (
    <div>
      <button className="menu-button" onClick={() => setMenuOpen(true)}>
        Menu
      </button>
      <div
        className={menuOpen === false ? "hidden" : "menu"}
        ref={menu}
        style={{ height: height }}
      >
        <div>
          <div className="menuTitle">
            Menu
            <button onClick={() => setMenuOpen(false)}>X</button>
          </div>
          <hr />
          <div onClick={() => setArchiveListOpen(true)}>
            Archived lists <img src={archive} />
          </div>
          <div onClick={() => setArchiveCardOpen(true)}>
            Archived cards <img src={archive} />
          </div>
          <div onClick={() => setShareBoard(true)}>
            Share board <img src={link} />
          </div>
        </div>
        {archiveListOpen === true ? (
          <ArchiveList
            height={height}
            back={() => setArchiveListOpen(false)}
            close={() => setMenuOpen(false)}
            lists={lists}
          />
        ) : null}
        {archiveCardOpen === true ? (
          <ArchiveCard
            height={height}
            back={() => setArchiveCardOpen(false)}
            close={() => setMenuOpen(false)}
            cards={cards}
          />
        ) : null}
        {shareBoard === true ? (
          <ShareBoard
            height={height}
            back={() => setShareBoard(false)}
            close={() => setMenuOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
};
