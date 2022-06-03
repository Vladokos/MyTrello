import React, { useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";

import { ArchiveList } from "./ArchiveList";
import { ArchiveCard } from "./ArchiveCard";
import { ShareBoard } from "./ShareBoard";

import OutsideClick from "../../hooks/OutsideClick";

import archive from "../../img/archive.svg";
import link from "../../img/makeLink.svg";

import "../../styles/Board/Menu.css";

let currentBoard;

export const Menu = ({ height, boards, lists, cards, socket, shareLink }) => {
  const params = useParams();

  const userId = localStorage.getItem("userId");

  useMemo(() => {
    for (let i = 0; i < boards.length; i++) {
      if (boards[i]._id === params.boardId) {
        currentBoard = boards[i];
      }
    }
  }, [boards]);



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
          {currentBoard.owner === userId ? (
            <div onClick={() => setShareBoard(true)}>
              Share board <img src={link} />
            </div>
          ) : null}
        </div>
        {archiveListOpen === true ? (
          <ArchiveList
            height={height}
            back={() => setArchiveListOpen(false)}
            close={() => setMenuOpen(false)}
            lists={lists}
            socket={socket}
          />
        ) : null}
        {archiveCardOpen === true ? (
          <ArchiveCard
            height={height}
            back={() => setArchiveCardOpen(false)}
            close={() => setMenuOpen(false)}
            cards={cards}
            socket={socket}
          />
        ) : null}
        {shareBoard === true ? (
          <ShareBoard
            height={height}
            back={() => setShareBoard(false)}
            close={() => setMenuOpen(false)}
            socket={socket}
            shareLink={shareLink}
          />
        ) : null}
      </div>
    </div>
  );
};
