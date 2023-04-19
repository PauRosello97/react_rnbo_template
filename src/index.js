import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import setup from './rnbo';

setup();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />

    <div id="rnbo-root">
      <div>
        <h1 id="patcher-title">Unnamed patcher</h1>
      </div>
      <div id="rnbo-clickable-keyboard">
        <h2>MIDI Keyboard</h2>
        <em id="no-midi-label">No MIDI input</em>
      </div>
      <div id="rnbo-inports">
        <h2>Inports</h2>
        <em id="no-inports-label">No inports available</em>
        <form id="inport-form" className="inport">
          <div className="inport-input">
            <select id="inport-select"></select>
            <input id="inport-text" type="text"></input>
            <input id="inport-submit" className="smallButton" type="submit" value="Send" />
          </div>
        </form>
      </div>
      <div id="rnbo-console">
        <h2>Outports</h2>
        <em id="no-outports-label">No outports available</em>
        <div id="rnbo-console-div">
          <p id="rnbo-console-readout">Waiting for messages...</p>
          <em id="rnbo-console-description">Check the developer console for more messages from the RNBO device</em>
        </div>
      </div>
      <div id="rnbo-presets">
        <h2>Presets</h2>
        <em id="no-presets-label">No presets defined</em>
        <select id="preset-select"></select>
      </div>
      <div id="rnbo-parameter-sliders">
        <h2>Parameters</h2>
        <em id="no-param-label">No parameters</em>
      </div>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
