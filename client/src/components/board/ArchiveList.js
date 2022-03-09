import React from "react";

import { useDispatch } from "react-redux";

import { unarchiveList, deleteList } from "../../features/lists/listsSlice";

import recycling from "../../img/recycling.svg";
import restore from "../../img/restore.svg";

import "../../styles/Board/ArchiveList.css";

export const ArchiveList = ({ height, back, close, lists }) => {
  const dispatch = useDispatch();

  const unarchive = (listId) => dispatch(unarchiveList({ listId }));
  const deleting = (listId) => dispatch(deleteList({ listId }));

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
                <img src={restore} onClick={() => unarchive(list._id)} />
                <img src={recycling} onClick={() => deleting(list._id)} />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
