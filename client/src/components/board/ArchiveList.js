import React from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import { unarchiveList, deleteList } from "../../features/lists/listsSlice";

import recycling from "../../img/recycling.svg";
import restore from "../../img/restore.svg";

import "../../styles/Board/ArchiveList.css";

export const ArchiveList = ({ height, back, close, lists, socket }) => {
  const params = useParams();

  const { boardId } = params;

  const dispatch = useDispatch();

  const unarchive = (listId) =>
    dispatch(unarchiveList({ listId })).then(() => {
      socket.emit("bond", { roomId: boardId, message: "list changed", listId });
    });
  const deleting = (listId) =>
    dispatch(deleteList({ listId })).then(() => {
      socket.emit("bond", { roomId: boardId, message: "list deleted", listId });
    });

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
