import { BasicHostPlugin, IChannel, IConduit } from "@sourceacademy/conductor";
import { UiHostPlugin } from "./UIHostPlugin";

/**
 * Demo Host that integrates BrowserHostPlugin and UiHostPlugin functionality
 */
export class DemoHost extends BasicHostPlugin {
  private uiHost: UiHostPlugin;
  
  constructor(conduit: IConduit, channels: IChannel<any>[]) {
    super(conduit, channels);
    
    // Register the UI host plugin as a sub-plugin
    this.uiHost = conduit.registerPlugin(UiHostPlugin);
    
    // Set up UI rendering
    this.setupUIRendering();
  }
  
  async requestFile(fileName: string): Promise<string | undefined> {
    return "blank";
  }
  
  requestLoadPlugin(pluginName: string): void {
    console.log("Host requested to load plugin:", pluginName);
  }
  
  private setupUIRendering(): void {
    // Get DOM elements
    const output = document.getElementById("output") as HTMLPreElement;
    const ui = document.getElementById("ui") as HTMLPreElement;
    
    // Capture console logs for output
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      const line = args.map(String).join(" ");
      if (output) {
        output.textContent += (output.textContent ? "\n" : "") + line;
      }
    };
    
    // Set up UI rendering callback
    this.uiHost.onRender = (_, tree) => {
      if (ui) {
        ui.textContent = this.uiHost.renderToString(tree);
      }
    };
  }
  
  // Override to handle output display
  receiveOutput(message: string): void {
    super.receiveOutput?.(message);
    const output = document.getElementById("output") as HTMLPreElement;
    if (output) {
      output.textContent += (output.textContent ? "\n" : "") + message;
    }
  }
}
