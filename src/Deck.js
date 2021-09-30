import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

/* Deck of cards - uses card API to generate cards */

function Deck() {
  const [deck, setDeck] = useState(null); //deck
  const [drawn, setDrawn] = useState([]); //drawn cards
  const [autoDraw, setAutoDraw] = useState(false); //option for autodraw
  const timerRef = useRef(null); //Timer

  /* At mount: load deck from API into state. */
  useEffect(() => {
    async function getData() {
      let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    getData();
  }, [setDeck]);

  /* Draw one card every second if autoDraw is true */
  useEffect(() => {
    /* Draw a card via API, add card to state "drawn" list */
    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

        if (drawRes.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("no cards remaining!");
        }

        const card = drawRes.data.cards[0];

        setDrawn(d => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image
          }
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      //timerRef.current is the setInterval ID, used for turning it off
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    //Cleanup
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  //on/off toggle for autodraw
  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  };

  //Generate an array of Card components
  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  //Return the "deck" component, which consists of a bunch of Card components and a button
  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;
