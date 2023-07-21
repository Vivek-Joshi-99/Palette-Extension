import { provideVSCodeDesignSystem, Button, allComponents,Dropdown} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(allComponents);

// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();

// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

// Main function that gets executed once the webview DOM loads
function main() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  const introButton = document.getElementById("intro") as Button;
  introButton?.addEventListener("click", handleIntroClick);
  const loginButton = document.getElementById("login") as Button;
  loginButton?.addEventListener("click", handleLoginClick);
  const project = document.getElementById("projects");
  project?.addEventListener("change",handleProject);
  const clusterGroup = document.getElementById("clusterGroups");
  clusterGroup?.addEventListener("change",handleClusterGroup);
  const conf = document.getElementById("conf");
  conf?.addEventListener("click",handleConf);
  const radioButtons = document.getElementsByName('cluster_radio');
  for (let radio of radioButtons) {
    radio.addEventListener("click",handleRadio);
  }
  const download = document.getElementById("downloadC");
  download?.addEventListener("click",downloadKube);
  const deleteC = document.getElementById("deleteC");
  deleteC?.addEventListener("click",deleteCluster);
  const createC = document.getElementById("createC");
  createC?.addEventListener("click",createCluster);
  const submitCreate = document.getElementById("submitCreate");
  submitCreate?.addEventListener("click",handleSubmitCreate);
  const back = document.getElementById("back");
  back?.addEventListener("click",goBack);
  const refresh = document.getElementById("refresh");
  refresh?.addEventListener("click",handleRefresh);
  const resize = document.getElementById("resizeC");
  resize?.addEventListener("click",handleResize);
  const submitResize = document.getElementById("submitResize");
  submitResize?.addEventListener("click",handleSubmitResize);
  const pause = document.getElementById('pauseC');
  pause?.addEventListener("click",handlePause);
  const resume = document.getElementById('resumeC');
  resume?.addEventListener("click",handleResume);
}


function handleIntroClick() {
  const btn = document.getElementById("btn");
  vscode.postMessage({
    command: "hello",
    text: "Access"
  });
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
}

function handleLoginClick() {
  const form = <HTMLFormElement>document.getElementById("form");
  const btn = document.getElementById("btn");
  const data:string[] = [];
  if(form){
    for(let i=0;i<form.elements.length;i++)
    {
      let inputData = <HTMLInputElement>form.elements[i]; 
      data.push(inputData.value);
    }
  }
  vscode.postMessage({
    command: "login",
    data: data
  })
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
}

function handleProject() {
  const project = document.getElementById("projects") as Dropdown;
  const projectAndClusterGroup = document.getElementById("projectAndClusterGroup");
  vscode.postMessage({
    command: "changeProject",
    data: project.value,
  });
  if (projectAndClusterGroup != undefined) {
    projectAndClusterGroup.innerHTML += "<vscode-progress-ring></vscode-progress-ring>";
  }
}

function handleClusterGroup() {
  const clusterGroup = document.getElementById("clusterGroups") as Dropdown;
  vscode.postMessage({
    command: "changeClusterGroup",
    data: clusterGroup.value,
  });
}

function handleConf() {
  vscode.postMessage({
    command: "changeAPIKey",
    data: "Placeholder",
  });
}

function handleRadio() {
  const radioButtonss = document.getElementsByName('cluster_radio') as any;
  for (let radio of radioButtonss) {
    if(radio.checked){
      vscode.postMessage({
        command: "selectCluster",
        data: radio.value,
      });
    }
  }
}

function downloadKube(){
  let radioButtons = document.getElementsByName('cluster_radio') as any;
  let flag = 0;
  const btn = document.getElementById("btndownload");
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
  for (let radio of radioButtons) {
    if(radio.checked){
      flag=1;
      vscode.postMessage({
        command: "downloadKube",
        data: radio.value,
      });
    }
  }
  if(flag == 0){
    vscode.postMessage({
      command: "noSelection",
      data: "placeholder",
    });
  }
}

function deleteCluster() {
  let radioButtons = document.getElementsByName('cluster_radio') as any;
  const btn = document.getElementById("btndelete");
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
  let flag = 0;
  for (let radio of radioButtons) {
    if(radio.checked){
      flag = 1;
      vscode.postMessage({
        command: "deleteCluster",
        data: radio.value,
      });
    }

  }
  if(flag == 0){
    vscode.postMessage({
      command: "noSelection",
      data: "placeholder",
    });
  }
}

function createCluster() {
  vscode.postMessage({
    command: "createCluster",
    data: "placeholder",
  });
}

function handleSubmitCreate() {
  const form = document.getElementById("form") as any;
  const data:string[] = [];
  const btn = document.getElementById("btn");
  if(form){
      for(let i=0;i<form.elements.length;i++)
      {
          data.push(form.elements[i].value);
      }
  }

  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }

  vscode.postMessage({
    command: "submitCreate",
    data: data,
  });
}

function goBack() {
  vscode.postMessage({
    command: "back",
    data: "Placeholder",
  });
}

function handleRefresh() {
  const btn = document.getElementById("btn");
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
  vscode.postMessage({
    command: "refresh",
    data: "palceholder",
  });
}

function handleResize() {
  let radioButtons = document.getElementsByName('cluster_radio') as any;
  let flag = 0;
  for (let radio of radioButtons) {
    if(radio.checked){
      flag=1;
      vscode.postMessage({
        command: "resize",
        data: radio.value,
      });
    }
  }
  if(flag == 0){
    vscode.postMessage({
      command: "noSelection",
      data: "placeholder",
    });
  }
}

function handleSubmitResize() {
  const form = document.getElementById("form") as any;
  const data:string[] = [];
  const btn = document.getElementById("btn");
  if(form){
      for(let i=0;i<form.elements.length;i++)
      {
          data.push(form.elements[i].value);
      }
  }
  
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }

  vscode.postMessage({
    command: "submitResize",
    data: data,
  });
}

function handleResume() {
  let radioButtons = document.getElementsByName('cluster_radio') as any;
  const btn = document.getElementById("btnresume");
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
  let flag = 0;
  for (let radio of radioButtons) {
    if(radio.checked){
      flag = 1;
      vscode.postMessage({
        command: "resumeCluster",
        data: radio.value,
      });
    }

  }
  if(flag == 0){
    vscode.postMessage({
      command: "noSelection",
      data: "placeholder",
    });
  }
}

function handlePause() {
  let radioButtons = document.getElementsByName('cluster_radio') as any;
  const btn = document.getElementById("btnpause");
  if (btn != undefined) {
    btn.innerHTML = "<vscode-progress-ring></vscode-progress-ring>";
  }
  let flag = 0;
  for (let radio of radioButtons) {
    if(radio.checked){
      flag = 1;
      vscode.postMessage({
        command: "pauseCluster",
        data: radio.value,
      });
    }

  }
  if(flag == 0){
    vscode.postMessage({
      command: "noSelection",
      data: "placeholder",
    });
  }
}

  // Some quick background:
  //
  // Webviews are sandboxed environments where abritrary HTML, CSS, and
  // JavaScript can be executed and rendered (i.e. it's basically an iframe).
  //
  // Because of this sandboxed nature, VS Code uses a mechanism of message
  // passing to get data from the extension context (i.e. src/panels/HelloWorldPanel.ts)
  // to the webview context (this file), all while maintaining security.
  //
  // vscode.postMessage() is the API that can be used to pass data from
  // the webview context back to the extension context––you can think of
  // this like sending data from the frontend to the backend of the extension.
  //
  //
  // Note: If you instead want to send data from the extension context to the
  // webview context (i.e. backend to frontend), you can find documentation for
  // that here:
  //
  // https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview
  //
  // The main thing to note is that postMessage() takes an object as a parameter.
  // This means arbitrary data (key-value pairs) can be added to the object
  // and then accessed when the message is recieved in the extension context.
  //
  // For example, the below object could also look like this:
  // {
  //  command: "hello",
  //  text: "Hey there partner! 🤠",
  //  random: ["arbitrary", "data"],
  // }
  //
