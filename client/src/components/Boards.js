import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const Boards = () => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const { id } = params;
    axios({
      config: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      method: "POST",
      url: "/welcome",
      data: {
        id: id,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response.data === "Error" || error.response.status === 400) {
          navigate("/sig");
        }
        console.log(error.response);
      });
  });

  return (
    <div>
      test component
      <div>test</div>
    </div>
  );
};
