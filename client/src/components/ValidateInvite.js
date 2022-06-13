import React, { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Loader } from "./blanks/Loader";

export const ValidateInvite = ({ socket }) => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) navigate("/");

    const link = window.location.href;

    socket.emit("validateInvite", { link, userId });
  }, []);

  useEffect(() => {
    socket.on("validateInvite", (data) => {
      console.log(data);

      socket.off("validateInvite");

      if (data === "Already added") {
        navigate("/board/" + params.boardId + "/" + params.name);
      } else if (data === "Added") {
        const roomId = params.boardId;
        socket.emit("room", roomId);

        navigate("/board/" + params.boardId + "/" + params.name);
      }
    });
  }, [socket]);

  return <Loader />;
};
