import React, { useState,  } from 'react';

const AddYear = ({ character, setCharacter, setLogMessage }) => {
  const [isDead, setIsDead] = useState(false);

  const handleAgeIncrement = () => {
    if (character) {
      if (character.Age > 50) {
        const deathChance = Math.random();
        if (deathChance < 0.10) {
          setIsDead(true);
          setLogMessage(prevLog => prevLog + "\n" + character.FirstName + " " + character.LastName + " has died.");
          return;
        }
      }
      setCharacter(prevCharacter => ({
        ...prevCharacter,
        Age: prevCharacter.Age + 1
      }));
      setLogMessage(prevLog => prevLog + `\n${character.FirstName} is now ${character.Age + 1}\nYear Summary: [Add summary for the year here]`);
    }
  };

  const handleRestart = () => {
    const userConfirmed = window.confirm("Are you sure you want to restart?");
    
    if (userConfirmed) {
      setIsDead(false);
      setCharacter(null);
      setLogMessage("");

      // event to notify about the reset
      const resetEvent = new Event('characterReset', { 'bubbles': true });
      window.dispatchEvent(resetEvent);
    }
};

  if (isDead) {
    return (
      <div>
       <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <button onClick={handleAgeIncrement}>Add a Year</button>
  );
};

export default AddYear;