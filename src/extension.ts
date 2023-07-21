import { commands, ExtensionContext } from "vscode";
import { HelloWorldPanel } from "./panels/WizardPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand("pde-plugin.openWizard", () => {
    HelloWorldPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
