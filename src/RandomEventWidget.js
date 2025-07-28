import React, { useState, useEffect } from 'react';
import eventsData from './randomEvents.json';
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
  setMetPeople
}) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Filter events by age and not used
    const available = eventsData.filter(e =>
      age >= e.ageMin &&
      age <= e.ageMax &&
      !usedEventIds.includes(e.id)
    );
    if (available.length > 0) {
      setEvent(available[Math.floor(Math.random() * available.length)]);
    }
  }, [age, usedEventIds]);

  const handleOption = (opt) => {
    let logMsg = `<br>${toFirstPerson(event.prompt)}<br>${toFirstPerson(opt.outcome)}`;
    if (event.id === "lost_dog" && opt.outcomeId === "2") {
      const dogName = window.prompt("You kept the dog! What will you name your new companion?");
      if (dogName) {
        logMsg += `<br>I named my dog ${dogName}.`;
        setMetPeople(prev => [...prev, { name: dogName, type: "dog", clickable: false }]);
      }
    }
    onLog(logMsg);
    onClose(event.id);
  };

  if (!event) return null;

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