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
    <div className="modal">
      <div className="modal-content">
        <h2>Random Event</h2>
        <p>{event.prompt}</p>
        {event.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOption(opt)}
            style={{ margin: '8px 0' }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RandomEventWidget;