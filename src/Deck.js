import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function getData() {
      let res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      //   console.log(res.data.deck_id);
      setDeck(res.data);
    }
    getData();
  }, [setDeck]);

  useEffect(() => {
    async function getCard() {
      let { deck_id } = deck;
      try {
        let res = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
        if (res.data.remaining === 0) {
          setAutoDraw(false);
          alert("No more cards!");
        }

        const card = res.data.cards[0];

        setDrawn((d) => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
          },
        ]);
      } catch (e) {
        alert(e);
      }
    }
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 500);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const cards = drawn.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-draw-btn" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "START"} DRAWING
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
};

export default Deck;
