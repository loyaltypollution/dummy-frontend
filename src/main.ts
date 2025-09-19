import { Conduit } from "@sourceacademy/conductor";
import { DemoHost } from "./DemoHost";

// Create a worker that runs the evaluator bundle
const worker = new Worker("/echo-slang/dist/index.js", { type: "module" });

// Create a host conduit that communicates with the worker
const conduit = new Conduit(worker, true);

// Register our demo host (which includes BrowserHost + UiHost functionality)
const demoHost = conduit.registerPlugin(DemoHost);

// Set up DOM interaction
const input = document.getElementById("chunk-input") as HTMLInputElement;
const button = document.getElementById("send-btn") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLPreElement;

button.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  
  // Clear UI output
  const ui = document.getElementById("ui") as HTMLPreElement;
  if (ui) ui.textContent = "";
  
  if (output) {
    output.textContent += (output.textContent ? "\n" : "") + `> ${text}`;
  }
  
  // Send chunk to evaluator
  demoHost.sendChunk(text);
});

// Start the evaluator with the entry point
demoHost.startEvaluator("index.js");