import './App.css';
import CharacterGen from './CharacterGen';

function App() {
  return (
    <div className="App">
      <div className="App-log">
        <textarea readOnly placeholder="Yearly log will appear here..."></textarea>
        <button>Add a Year</button>
      </div>
      <div className="CharacterGen">
        <CharacterGen />
      </div>
    </div>
  );
}

export default App;