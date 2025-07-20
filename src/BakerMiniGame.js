import React, { useState, useEffect, useRef } from 'react';
import pies from './pies.json';

function getRandomPie() {
  // Weighted random by rarity (lower rarity = more common)
  const weighted = [];
  pies.forEach(pie => {
    for (let i = 0; i < (101 - pie.rarity); i++) weighted.push(pie);
  });
  return weighted[Math.floor(Math.random() * weighted.length)];
}

export default function BakerMiniGame({ onResult, setInventory, setCoins, character }) {
  const [sliderPos, setSliderPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(2);
  const [targetStart, setTargetStart] = useState(30);
  const [targetEnd, setTargetEnd] = useState(50);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        setSliderPos(prev => {
          let next = prev + direction * speed;
          if (next > 100) {
            setDirection(-1);
            next = 100;
          } else if (next < 0) {
            setDirection(1);
            next = 0;
          }
          return next;
        });
      }, 16);
      return () => clearInterval(intervalRef.current);
    }
  }, [started, direction, speed]);

  const startGame = () => {
    setStarted(true);
    setMessage('Click "Bake!" when the slider is in the green zone!');
    setSliderPos(0);
    setDirection(1);
    setSpeed(2 + streak);
    const start = Math.floor(Math.random() * 70);
    setTargetStart(start);
    setTargetEnd(start + 20);
  };

  const handleBake = () => {
    clearInterval(intervalRef.current);
    setStarted(false);

    // Prevent error if character or Age is missing
    if (!character || typeof character.Age !== "number") {
      setMessage("Error: No character or age found. Please create a character first!");
      if (onResult) onResult(false, null);
      return;
    }

    if (sliderPos >= targetStart && sliderPos <= targetEnd) {
      const pie = getRandomPie();
      setInventory(prev => [
        ...prev,
        { name: pie.name, rarity: pie.rarity, sellPrice: pie.sellPrice, addedYear: character.Age }
      ]);
      setCoins(prev => prev + pie.sellPrice);
      setMessage(`Perfect! You baked a ${pie.name} 🥧 (worth ${pie.sellPrice} coins)`);
      setStreak(prev => prev + 1);
      if (onResult) onResult(true, pie);
    } else {
      setMessage('Missed! The bread is burnt. Streak reset.');
      setStreak(0);
      if (onResult) onResult(false, null);
    }
  };

  const noCharacter = !character || typeof character.Age !== "number";

  return (
    <div className="baker-mini-game">
      <h3>Baker Mini-Game</h3>
      {noCharacter ? (
        <div style={{ color: "#d32f2f", fontWeight: "bold", margin: "18px 0" }}>
          Error: No character or age found. Please create a character first!
        </div>
      ) : (
        <>
          <div style={{ margin: '12px 0' }}>
            <div className="slider-bar" style={{ position: 'relative', width: '320px', height: '24px', background: '#ffe066', borderRadius: '12px', margin: '0 auto' }}>
              <div style={{
                position: 'absolute',
                left: `${targetStart / 100 * 320}px`,
                width: `${(targetEnd - targetStart) / 100 * 320}px`,
                height: '100%',
                background: 'limegreen',
                borderRadius: '12px',
                opacity: 0.7
              }} />
              <div style={{
                position: 'absolute',
                left: `${sliderPos / 100 * 320}px`,
                top: '-6px',
                width: '16px',
                height: '36px',
                background: '#ff9800',
                borderRadius: '8px',
                boxShadow: '0 0 8px #ff9800',
                transition: 'left 0.016s linear'
              }} />
            </div>
          </div>
          <div style={{ margin: '10px 0', fontWeight: 'bold' }}>Streak: {streak}</div>
          {!started ? (
            <button className="baker-btn" onClick={startGame}>Start Baking</button>
          ) : (
            <button className="baker-btn" onClick={handleBake}>Bake!</button>
          )}
          <div className="baker-message">{message}</div>
        </>
      )}
    </div>
  );
}