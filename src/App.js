
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import React, { useState, useRef, useEffect } from 'react';



function App() {
  const [logMessage, setLogMessage] = useState('');
  const [character, setCharacter] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);


  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logMessage]);

  return (
    <div className="App">
      <div className="App-log">
      <textarea ref={textareaRef} readOnly placeholder={logMessage}></textarea>
      <AddYear character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
      </div>
      <div className="CharacterGen">
      <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
      </div>
    </div>
  );
}

export default App;