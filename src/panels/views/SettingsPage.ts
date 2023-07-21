import { load } from "js-yaml";
import * as fs from "fs";
import * as os from "os";

export function getSettingsPage(projectList:string[],clusterGroupList:string[],clusterInfo:any,selectedRadio:any,isDisabled:boolean) {
    return `
      <body>
      <div class="settingsPage">
        <form  id="form" class="settingsForm">
          <div class="settingsPageConfig">
            <h2> Select Configuration </h2>
            <vscode-button id="conf" > Change API Key</vscode-button>
          </div>
          <div class="projectAndClusterGroup" id="projectAndClusterGroup">
            <p>Selected Project</p>
            <vscode-dropdown position="below" id="projects">
              ${getSelections("projectList",projectList)}
            </vscode-dropdown>
            <p>Selected Cluster Group</p>
            <vscode-dropdown position="below" id="clusterGroups">
              ${getSelections("clusterGroupList",clusterGroupList)}
            </vscode-dropdown>
          </div>
      </form>
          <vscode-divider role="separator"></vscode-divider>
          <div class="clusterSettings">
            <div class="settingsPageConfig">
              <h2>Virtual Clusters </h2>
              <vscode-button id="createC"> Create New Virtual Cluster</vscode-button>
            </div>
          </div>
          ${clusterInfo.length >1?getTableString(clusterInfo,selectedRadio):`No Active Virtual Clusters`}
          ${clusterInfo.length >1?`<div class="buttonArea">
            <div id="btndownload">
              <vscode-button id="downloadC" ${isDisabled?"disabled":""} > Download Kubeconfig</vscode-button>
            </div>
            <div id="btndelete">
              <vscode-button id="deleteC" > Delete</vscode-button>
            </div>
            <div id="btnresize">
              <vscode-button id="resizeC" > Resize</vscode-button>
            </div>
            <div id="btnpause">
              <vscode-button id="pauseC" > Pause</vscode-button>
            </div>
            <div id="btnresume">
              <vscode-button id="resumeC" > Resume</vscode-button>
            </div>
            <div id="btn">
              <vscode-button id="refresh" > Refresh</vscode-button>
            </div>
          </div>`:""}

      </div>    
      
      </body>
      `;
  }

  function getTableString(clusterInfo:any,selectedRadio:any) {
    let tableString = `
    <vscocde-data-grid grid-template-columns="repeat(10, minmax(0, 1fr))">
      <vscode-data-grid-row row-type="header">
        <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Select</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="2">Name</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="3">Project</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="4">Cluster Group</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="5">Cluster Group Scope</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="6">CPUs</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="7">Memory (GB)</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="8">Storage (GB)</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="9">Status</vscode-data-grid-cell>
        <vscode-data-grid-cell cell-type="columnheader" grid-column="10">Age</vscode-data-grid-cell>
      </vscode-data-grid-row>
    `;
    for(let i = 1;i<clusterInfo.length;i++)
    {
      tableString = tableString + '<vscode-data-grid-row>';
      if(i == selectedRadio){
        tableString = tableString + `<vscode-data-grid-cell grid-column="1"> <input type="radio" value="${i}" name="cluster_radio" checked/></vscode-data-grid-cell>`;
      }else{
        tableString = tableString + `<vscode-data-grid-cell grid-column="1"> <input type="radio" value="${i}" name="cluster_radio"/> </vscode-data-grid-cell>`;
      }
      for(let j = 0;j<9;j++)
      {
        tableString = tableString + `<vscode-data-grid-cell grid-column="${j+2}">${clusterInfo[i][j]}</vscode-data-grid-cell>`;
      }
      tableString = tableString + '</vscode-data-grid-row>';
    }
    tableString =tableString + "</vscocde-data-grid>";

    return tableString;
    
  }
  
  function getSelections(option:string,iterable:string[]): string {
    let homedir = os.homedir();
    let paletteFile = fs.readFileSync(
      `${homedir}/.palette/pde/pde.yaml`,
      "utf-8"
    );
    let pdeyaml = load(paletteFile) as any;
    let selected = pdeyaml.ClusterGroupName;
    let html: string = "";

    switch (option) {
      case "clusterGroupList":
        selected = pdeyaml.ClusterGroupName;
        break;
      case "projectList":
        selected = pdeyaml.ProjectName;
        break;
    }

    for (let i = 0; i < iterable.length; i++) {
      if (selected == iterable[i]) {
        html =
          html +
          `<vscode-option value="${iterable[i]}" selected>${iterable[i]}</vscode-option>`;
      } else {
        html = html + `<vscode-option value="${iterable[i]}">${iterable[i]}</vscode-option>`;
      }
    }
    return html;
  }
  