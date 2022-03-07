import React from "react";

import recycling from "../../img/recycling.svg";
import restore from "../../img/restore.svg";

import "../../styles/Board/ArchiveList.css";

export const ArchiveList = ({ height, back, close, lists }) => {
  return (
    <div className="archive" style={{ height: height - 90 }}>
      <div className="archiveTitle">
        <button onClick={back}>&#60;</button>
        Archived Lists
        <button onClick={close}>X</button>
      </div>
      <hr />

      <ul className="archivedLists">
        {lists.map((list) => {
          if (list.archived) {
            return (
              <li key={list._id}>
                {list.nameList}
                <img src={restore} />
                <img src={recycling} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
