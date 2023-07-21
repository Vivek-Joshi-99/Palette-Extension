import * as fs from "fs";
import * as os from "os";
import { load } from "js-yaml";

export function getResizePage(clusterName:string) {
    let homedir = os.homedir();
    let paletteFile = fs.readFileSync(`${homedir}/.palette/pde/pde.yaml`, "utf-8");
    let pdeyaml = load(paletteFile) as any;

    return `
      <body>
        <div class="creationPage">
          <h2>Active Configuration</h2>
          <p>Active Project:&nbsp;&nbsp;${pdeyaml.ProjectName}</p>
          <p>Active Cluster Group:&nbsp;&nbsp;${pdeyaml.ClusterGroupName}</p> 
          <p>Selected Cluster: &nbsp;&nbsp;${clusterName}</p>
          <vscode-divider role="separator"></vscode-divider>
          
          <form id="form" class="creationForm">
            <h2>Resize Virtual Cluster</h2>
            <vscode-text-field type='number' size="50">Cluster CPU</vscode-text-field>
            <vscode-text-field type='number' size="50">Cluster Memory (GBs)</vscode-text-field>
            <vscode-text-field type='number' size="50">Cluster Storage (GBs)</vscode-text-field>
        </form>
        <div class="buttonArea">
            <div id="btn">
                <vscode-button id="submitResize" > Resize Cluster</vscode-button>
            </div>
            <vscode-button id="back" appearance="secondary"> Back</vscode-button>
        </div>
        </div>
      </body>
    `;
  }
  