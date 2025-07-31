import React, { useState, useEffect } from 'react';
import eventsData from './randomEvents.json';
import { performSkillCheck } from './DiceRoll.js';
import './App.css';

function toFirstPerson(text) {
  return text
    .replace(/The young adventurer spots a/gi, "I spotted a")
    .replace(/the young adventurer spots a/gi, "I spotted a")
    .replace(/The young adventurer spot a/gi, "I spotted a")
    .replace(/the young adventurer spot a/gi, "I spotted a")
    .replace(/The young adventurer /gi, "I ")
    .replace(/the young adventurer /gi, "I ")
    .replace(/What do they do\?/gi, "I had to decide what to do.")
    .replace(/What do I do\?/gi, "I had to decide what to do.");
}

const RandomEventWidget = ({
  age,
  onLog,
  onClose,
  usedEventIds,
  setMetPeople,
  character,
  specificEventId
}) => {
  const [event, setEvent] = useState(null);
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [pendingOption, setPendingOption] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);

  useEffect(() => {
    // If a specific event ID is provided, use that event
    if (specificEventId) {
      const specificEvent = eventsData.find(e => e.id === specificEventId);
      if (specificEvent) {
        setEvent(specificEvent);
        return;
      }
    }
    
    // Filter events by age and not used
    const available = eventsData.filter(e =>
      age >= e.ageMin &&
      age <= e.ageMax &&
      !usedEventIds.includes(e.id)
    );
    if (available.length > 0) {
      setEvent(available[Math.floor(Math.random() * available.length)]);
    }
  }, [age, usedEventIds, specificEventId]);

  const handleDiceRoll = (option) => {
    setRolling(true);
    setRollResult(null);
    
    setTimeout(() => {
      const statName = option.rollType.charAt(0).toUpperCase() + option.rollType.slice(1);
      const checkResult = performSkillCheck(option.difficulty, character, statName);
      
      setRollResult(checkResult);
      setRolling(false);
    }, 1200);
  };

  const handleRollResult = (option) => {
    let outcome;
    if (rollResult.success) {
      outcome = option.successOutcome;
    } else {
      // Randomly select from failure outcomes
      const randomIndex = Math.floor(Math.random() * option.failureOutcomes.length);
      outcome = option.failureOutcomes[randomIndex];
    }

    let logMsg = `<br>${toFirstPerson(event.prompt)}<br>${outcome}`;
    
    // Handle special cases like naming the dog
    if (event.id === "lost_dog" && option.outcomeId === "lost_dog_keep_companion" && rollResult.success) {
      const dogName = window.prompt("You kept the dog! What will you name your new companion?");
      if (dogName) {
        logMsg += `<br>I named my dog ${dogName}.`;
        setMetPeople(prev => [...prev, { name: `${dogName} 🐕`, type: "dog", clickable: false }]);
      }
    }
    
    onLog(logMsg);
    onClose(event.id);
    setShowDiceRoll(false);
    setPendingOption(null);
    setRollResult(null);
  };

  const handleOption = (opt) => {
    if (opt.requiresRoll) {
      setPendingOption(opt);
      setShowDiceRoll(true);
    } else {
      let logMsg = `<br>${toFirstPerson(event.prompt)}<br>${toFirstPerson(opt.outcome)}`;
      if (event.id === "lost_dog" && opt.outcomeId === "lost_dog_keep_companion") {
        const dogName = window.prompt("You kept the dog! What will you name your new companion?");
        if (dogName) {
          logMsg += `<br>I named my dog ${dogName} 🐕.`;
          setMetPeople(prev => [...prev, { name: `${dogName} 🐕`, type: "dog", clickable: false }]);
        }
      }
      onLog(logMsg);
      onClose(event.id);
    }
  };

  if (!event) return null;

  if (showDiceRoll && pendingOption) {
    return (
      <>
        <div className="modal-backdrop" onClick={() => {
          setShowDiceRoll(false);
          setPendingOption(null);
          setRollResult(null);
          onClose(event.id);
        }} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000
        }} />
        <div className="random-event-widget">
          <h2>Skill Check Required</h2>
          <p>You need to make a {pendingOption.rollType} check (DC {pendingOption.difficulty}) to {pendingOption.text.toLowerCase()}.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div className="dice-container">
              <div className={`dice-d20${rolling ? ' rolling' : ''}`}>
                {rollResult ? rollResult.roll : (rolling ? "..." : "?")}
              </div>
            </div>
          </div>
          {rollResult && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p style={{ fontWeight: 'bold', color: rollResult.success ? 'green' : 'red' }}>
                {rollResult.success ? 'Success!' : 'Failure!'}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {!rollResult ? (
              <button
                className="event-option"
                onClick={() => handleDiceRoll(pendingOption)}
                disabled={rolling}
              >
                {rolling ? "Rolling..." : "Roll d20"}
              </button>
            ) : (
              <button
                className="event-option"
                onClick={() => handleRollResult(pendingOption)}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="modal-backdrop" onClick={() => onClose(event.id)} style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000
      }} />
      <div className="random-event-widget">
        <h2>Random Event</h2>
        <p>{event.prompt}</p>
        <div className="event-options">
          {event.options.map((opt, idx) => (
            <button
              key={idx}
              className="event-option"
              onClick={() => handleOption(opt)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default RandomEventWidget;