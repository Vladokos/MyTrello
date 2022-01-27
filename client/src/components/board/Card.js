import React, { useState, useEffect, useRef } from "react";

export const Card = ({list, cards}) => {
  return (
    <div className="cards">
      {list.cards.map((cardId) => {
        return cards.map((card) => {
          if (cardId === card._id) {
            return (
              <li key={card._id} className="card">
                {card.nameCard}
              </li>
            );
          }
        });
      })}
    </div>
  );
};
