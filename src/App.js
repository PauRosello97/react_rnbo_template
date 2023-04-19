import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
      <div id="rnbo-root">
        <div>
          <h1 id="patcher-title">Unnamed patcher</h1>
        </div>
        <div id="rnbo-clickable-keyboard">
          <h2>MIDI Keyboard</h2>
          <em id="no-midi-label">No MIDI input</em>
        </div>
        <div id="rnbo-parameter-sliders">
          <h2>Parameters</h2>
          <em id="no-param-label">No parameters</em>
        </div>
      </div>
    </div>
  );
}

export default App;
