import React, { useState } from 'react';
import './App.css';

const getDiceResult = () => Math.floor(Math.random() * 20) + 1;

const DiceRoll = ({ onClose, onResult, resultText }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  const rollDice = () => {
    setRolling(true);
    setResult(null);
    setTimeout(() => {
      const value = getDiceResult();
      setResult(value);
      setRolling(false);
      if (onResult) onResult(value);
    }, 1200);
  };

  const getResultText = (value) => {
    if (value === 1) return "Fail!";
    if (value === 20) return "Critical Success!";
    if (value >= 15) return "Great Success!";
    if (value >= 10) return "Success!";
    return "Poor Result";
  };

  return (
    <div className="dice-modal">
      <span className="dice-modal-close" onClick={onClose}>&times;</span>
      <h2>Dice Roll</h2>
      <div className="dice-container">
        <div className={`dice-d20${rolling ? ' rolling' : ''}`}>
          {result !== null ? result : (rolling ? "..." : "?")}
        </div>
      </div>
      {result === null ? (
        <button className="fantasy-button" onClick={rollDice} disabled={rolling}>
          {rolling ? "Rolling..." : "Roll D20"}
        </button>
      ) : (
        <button className="fantasy-button" onClick={onClose}>
          Close
        </button>
      )}
      {result !== null && (
        <div className="dice-result-text">
          {resultText ? resultText : getResultText(result)}
        </div>
      )}
    </div>
  );
};

export default DiceRoll;