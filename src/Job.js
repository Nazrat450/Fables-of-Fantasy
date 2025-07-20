import React, { useState } from 'react';
import DiceRoll from './DiceRoll';
import BakerMiniGame from './BakerMiniGame';
import BlacksmithMiniGame from './BlacksmithMiniGame';
import './App.css';

const JOBS = [
  {
    title: "Blacksmith",
    positions: ["Apprentice", "Journeyman", "Master"],
    pay: [10, 25, 50],
    skills: ["Strength", "Constitution"]
  },
  {
    title: "Merchant",
    positions: ["Clerk", "Trader", "Shopkeeper"],
    pay: [8, 20, 40],
    skills: ["Charisma", "Intelligence"]
  },
  {
    title: "Thief",
    positions: ["Pickpocket", "Burglar", "Master Thief"],
    pay: [12, 30, 60],
    skills: ["Stealth", "Dexterity"]
  },
  {
    title: "Guard",
    positions: ["Gate Guard", "Patrol", "Captain"],
    pay: [9, 22, 45],
    skills: ["Strength", "Wisdom"]
  },
  {
    title: "Bard",
    positions: ["Street Performer", "Tavern Singer", "Court Musician"],
    pay: [7, 18, 35],
    skills: ["Charisma", "Wisdom"]
  },
  {
    title: "Wizard's Assistant",
    positions: ["Scroll Sorter", "Potion Mixer", "Spell Tester"],
    pay: [11, 28, 55],
    skills: ["Intelligence", "Constitution"]
  },
  {
    title: "Baker",
    positions: ["Bakery Assistant", "Bread Maker", "Master Baker"],
    pay: [12, 28, 55],
    skills: ["Constitution", "Dexterity"]
  }
];

function getRandomJobs(n = 3) {
  const shuffled = JOBS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n).map(job => {
    const posIdx = Math.floor(Math.random() * job.positions.length);
    return {
      title: job.title,
      position: job.positions[posIdx],
      pay: job.pay[posIdx],
      skills: job.skills
    };
  });
}

const Job = ({
  character,
  job,
  setJob,
  coins,
  setCoins,
  showJob,
  setShowJob,
  showDice,
  setShowDice,
  diceCallback,
  setDiceCallback,
  diceResultText,
  setDiceResultText,
  setLogMessage,
  setInventory
}) => {
  const [jobOptions, setJobOptions] = useState([]);
  const [jobMessage, setJobMessage] = useState('');

  // Show jobs if none selected
  const handleFindJob = () => {
    if (character && character.Age < 16) {
      setJobMessage('You must be at least 16 years old to get a job.');
      setJobOptions([]);
      return;
    }
    if (job) {
      setJobMessage('You already have a job. Quit your current job to find a new one.');
      setJobOptions([]);
      return;
    }
    setJobOptions(getRandomJobs());
    setJobMessage('');
  };

  // Apply for a job (dice roll)
  const handleApply = (jobObj) => {
    setShowDice(true);
    setDiceCallback(() => (roll) => {
      let neededRoll = 10;

      // Check if character has a high relevant skill
      if (character) {
        for (const skill of jobObj.skills) {
          // Skill names must match character property names (e.g. "Strength", "Charisma", etc.)
          if (character[skill] >= 15) {
            neededRoll -= 3;
          }
        }
        // Clamp to minimum of 2
        neededRoll = Math.max(2, neededRoll);
      }

      let resultText;
      if (roll >= neededRoll) {
        setJob(jobObj);
        setCoins(prev => prev + jobObj.pay);
        setJobMessage(`Success! You got the job as ${jobObj.position} (${jobObj.title}) and earned ${jobObj.pay} coins.`);
        resultText = `Success! You rolled ${roll} (needed ${neededRoll}+).`;
        // Add to log
        if (typeof setLogMessage === "function") {
          setLogMessage(prevLog => prevLog + `<br>Got a job as a ${jobObj.position} (${jobObj.title}).`);
        }
      } else {
        setJobMessage(`Fail! You rolled ${roll}, needed ${neededRoll}+. Try again next time.`);
        resultText = `Fail! You rolled ${roll}, needed ${neededRoll}+.`;
      }
      setDiceResultText(resultText);
      setJobOptions([]);
    });
  };

  // Quit job
  const handleQuitJob = () => {
    setJob(null);
    setJobMessage('You quit your job.');
  };

  // Find new job
  const handleFindNewJob = () => {
    if (!job) {
      setJobMessage('You do not have a job to replace.');
      setJobOptions([]);
      return;
    }
    setJob(null);
    setJobOptions(getRandomJobs());
    setJobMessage('Choose a new job:');
  };

  return showJob ? (
    <>
      <div className="modal-backdrop" onClick={() => setShowJob(false)} style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9
      }} />
      <div className="shop-modal">
        <span className="shop-modal-close" onClick={() => setShowJob(false)}>&times;</span>
        <h2>Jobs</h2>
        {character && character.Age < 16 ? (
          <p style={{ marginTop: '18px', color: '#d32f2f', fontWeight: 'bold' }}>
            You must be at least 16 years old to get a job.
          </p>
        ) : job ? (
          <div>
            <p><strong>Current Job:</strong> {job.position} ({job.title})</p>
            <p><strong>Pay Rate:</strong> {job.pay} coins/week</p>
            <p><strong>Skills Needed:</strong> {job.skills.join(', ')}</p>
            <button onClick={handleFindNewJob}>Find New Job</button>
            <button onClick={handleQuitJob}>Quit Job</button>
            {job.title === "Baker" && (
              <BakerMiniGame
                onResult={(success, pie) => {
                  if (success) {
                    setLogMessage(prevLog => prevLog + `<br>Baked a ${pie.name} and earned ${pie.sellPrice} coins!`);
                  } else {
                    setLogMessage(prevLog => prevLog + `<br>Baking failed. Try again next time!`);
                  }
                }}
                setInventory={setInventory}
                setCoins={setCoins}
                character={character}
              />
            )}
            {job.title === "Blacksmith" && (
              <BlacksmithMiniGame
                onResult={success => {           
                }}
              />
            )}
          </div>
        ) : (
          <div>
            <button onClick={handleFindJob}>Find a Job</button>
          </div>
        )}
        {jobOptions.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <h3>Available Jobs</h3>
            {jobOptions.map((jobObj, idx) => {
              let neededRoll = 10;
              if (character) {
                for (const skill of jobObj.skills) {
                  if (character[skill] >= 15) {
                    neededRoll -= 3;
                  }
                }
                neededRoll = Math.max(2, neededRoll);
              }
              return (
                <div key={idx} className="shop-item">
                  <span>
                    <strong>{jobObj.position}</strong> ({jobObj.title})<br />
                    Pay: {jobObj.pay} coins<br />
                    Skills: {jobObj.skills.join(', ')}<br />
                    Needed Roll: {neededRoll}+
                  </span>
                  <button onClick={() => handleApply(jobObj)}>Apply</button>
                </div>
              );
            })}
          </div>
        )}
        {jobMessage && <p className="shop-message">{jobMessage}</p>}
      </div>
      {showDice && (
        <>
          <div className="menu-drawer-backdrop" onClick={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }} />
          <DiceRoll
            onClose={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }}
            onResult={diceCallback}
            resultText={diceResultText}
          />
        </>
      )}
    </>
  ) : null;
};

export default Job;