import React, { useState } from 'react';
import { calculateModifier } from './utils.js';
import './App.css';

// Core dice rolling logic
const getDiceResult = () => Math.floor(Math.random() * 20) + 1;

// Calculate skill check result
const calculateSkillCheck = (dc, character, statName) => {
  const roll = getDiceResult();
  const statValue = character?.[statName] || 0;
  const modifier = calculateModifier(statValue);
  const total = roll + modifier;
  const success = total >= dc;
  
  return {
    roll,
    modifier,
    total,
    success,
    dc,
    statName,
    statValue
  };
};

// Simple dice roll (for backward compatibility)
const DiceRoll = ({ onClose, onResult, resultText, dc, character, statName, onSkillCheckResult }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [skillCheckResult, setSkillCheckResult] = useState(null);

  const rollDice = () => {
    setRolling(true);
    setResult(null);
    setSkillCheckResult(null);
    
    setTimeout(() => {
      if (dc && character && statName) {
        // Skill check mode
        const checkResult = calculateSkillCheck(dc, character, statName);
        setSkillCheckResult(checkResult);
        setRolling(false);
        if (onSkillCheckResult) onSkillCheckResult(checkResult);
      } else {
        // Simple dice roll mode
        const value = getDiceResult();
        setResult(value);
        setRolling(false);
        if (onResult) onResult(value);
      }
    }, 1200);
  };

  const getResultText = (value) => {
    if (value === 1) return "Fail!";
    if (value === 20) return "Critical Success!";
    if (value >= 15) return "Great Success!";
    if (value >= 10) return "Success!";
    return "Poor Result";
  };

  // Skill check UI
  if (dc && character && statName) {
    return (
      <div className="dice-modal">
        <span className="dice-modal-close" onClick={onClose}>&times;</span>
        <h2>Skill Check Required</h2>
        <p>You need to make a {statName.toLowerCase()} check (DC {dc}) to succeed.</p>
        <div className="dice-container">
          <div className={`dice-d20${rolling ? ' rolling' : ''}`}>
            {skillCheckResult ? skillCheckResult.roll : (rolling ? "..." : "?")}
          </div>
        </div>
        {skillCheckResult && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontWeight: 'bold', color: skillCheckResult.success ? 'green' : 'red' }}>
              {skillCheckResult.success ? 'Success!' : 'Failure!'}
            </p>
          </div>
        )}
        {skillCheckResult === null ? (
          <button className="fantasy-button" onClick={rollDice} disabled={rolling}>
            {rolling ? "Rolling..." : "Roll d20"}
          </button>
        ) : (
          <button className="fantasy-button" onClick={onClose}>
            Continue
          </button>
        )}
      </div>
    );
  }

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

export const performSkillCheck = calculateSkillCheck;

export const getStatModifier = (character, statName) => {
  const statValue = character?.[statName] || 0;
  return calculateModifier(statValue);
};

export default DiceRoll;