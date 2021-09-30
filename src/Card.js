import React, { useState } from "react";
import './Card.css';

/** Picks a card, any card... step right up folks */

function Card({name, image}) {

  //Just taken from the solution - I'm not this clever
  const [{angle, xPos, yPos}] = useState({
    angle: Math.random() * 90 - 45,
    xPos: Math.random() * 40 - 20,
    yPos: Math.random() * 40 - 20
  });

  //Calculates the inline style for the card image
  const transform = `translate(${xPos}px, ${yPos}px) rotate(${angle}deg)`;

  return <img className="Card"
            alt={name}
            src={image}
            style={{transform}} />;
}

export default Card
