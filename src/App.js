
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import React, { useState } from 'react';

function App() {
  const [logMessage, setLogMessage] = useState('');
  const [character, setCharacter] = useState(null);
  
  return (
    <div className="App">
      <div className="App-log">
      <textarea readOnly placeholder={logMessage}></textarea>
        <AddYear character={character} setCharacter={setCharacter} setLogMessage={setLogMessage} />

      </div>
      <div className="CharacterGen">
      <CharacterGen character={character} setCharacter={setCharacter} setLogMessage={setLogMessage} />
      </div>
    </div>
  );
}


export default App;