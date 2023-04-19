/* eslint-disable */
import './App.css';

import { useState, useEffect } from "react";

function App() {

  useEffect(() => {
    setupRNBO();
  }, []);

  const [parameters, setParameters] = useState([]);

  async function setupRNBO() {
    const patchExportURL = " export/patch.export.json";

    // Create AudioContext
    const WAContext = window.AudioContext || window.webkitAudioContext;
    const context = new WAContext();

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);

    // Fetch the exported patcher
    let response, patcher;
    try {
      response = await fetch(patchExportURL);
      patcher = await response.json();

      if (!window.RNBO) {
        // Load RNBO script dynamically
        // Note that you can skip this by knowing the RNBO version of your patch
        // beforehand and just include it using a <script> tag
        await loadRNBOScript(patcher.desc.meta.rnboversion);
      }

    } catch (err) {
      console.log(err);
      const errorContext = {
        error: err
      };
      if (response && (response.status >= 300 || response.status < 200)) {
        errorContext.header = `Couldn't load patcher export bundle`,
          errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
          ` trying to load "${patchExportURL}". If that doesn't` +
          ` match the name of the file you exported from RNBO, modify` +
          ` patchExportURL in app.js.`;
      }
      if (typeof guardrails === "function") {
        guardrails(errorContext);
      } else {
        throw err;
      }
      return;
    }

    // (Optional) Fetch the dependencies
    let dependencies = [];
    try {
      const dependenciesResponse = await fetch("export/dependencies.json");
      dependencies = await dependenciesResponse.json();

      // Prepend "export" to any file dependenciies
      dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
    } catch (e) { }

    // Create the device
    let device;
    try {
      device = await RNBO.createDevice({ context, patcher });
    } catch (err) {
      if (typeof guardrails === "function") {
        guardrails({ error: err });
      } else {
        throw err;
      }
      return;
    }

    // (Optional) Load the samples
    if (dependencies.length)
      await device.loadDataBufferDependencies(dependencies);

    // Connect the device to the web audio graph
    device.node.connect(outputNode);

    // (Optional) Extract the name and rnbo version of the patcher from the description
    document.getElementById("patcher-title").innerText = (patcher.desc.meta.filename || "Unnamed Patcher") + " (v" + patcher.desc.meta.rnboversion + ")";

    setParameters(device.parameters);

    document.body.onclick = () => {
      context.resume();
    }
  }

  function loadRNBOScript(version) {
    return new Promise((resolve, reject) => {
      if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
        throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
      }
      const el = document.createElement("script");
      el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";
      el.onload = resolve;
      el.onerror = function (err) {
        console.log(err);
        reject(new Error("Failed to load rnbo.js v" + version));
      };
      document.body.append(el);
    });
  }

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

      {
        parameters.map((param, i) => {
          return <div key={i}>
            {param.id}
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={.1}
              value={param.value}
              onChange={(e) => {
                let newArray = [...parameters];
                newArray[i].value = Number.parseFloat(e.target.value);
                setParameters(newArray);
              }}
            />
            {param.value}
          </div>
        })
      }
    </div>
  );
}

export default App;
