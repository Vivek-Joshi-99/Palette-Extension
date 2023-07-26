import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import * as fs from "fs";
import * as os from "os";
import { load } from "js-yaml";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { getIntroPage } from "./views/IntroPage";
import { getLoginPage } from "./views/LoginPage";
import { getLoadingPage } from "./views/LoadingPage";
import { paletteLogin } from "../utilities/paletteLogin";
import { getSettingsPage } from "./views/SettingsPage";
import { getClusterGroupList } from "../utilities/getClusterGroupList";
import { getProjectList } from "../utilities/getProjList";
import { switchConfig } from "../utilities/switchConfig";
import { getClusterList } from "../utilities/getClusterList";
import { downloadKube } from "../utilities/downloadKube";
import * as vscode from "vscode";
import { deleteCluster } from "../utilities/deleteCluster";
import { getCreationPage } from "./views/CreationPage";
import { createCluster } from "../utilities/createCluster";
import { getResizePage } from "./views/ResizePage";
import { resizeCluster } from "../utilities/resizeCluster";
import { pauseCluster } from "../utilities/pauseCluster";
import { resumeCluster } from "../utilities/resumeCluster";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class HelloWorldPanel {
  public static currentPanel: HelloWorldPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private extensionUri: Uri;
  private error: string = "";
  private success: string = "";
  private pdeyaml: any;
  private homedir: string;
  private paletteFile: any;
  private clusterGroupList: string[] = [];
  private projectList: string[] = [];
  private clusterList: string[] = [];
  private clusterInfo: string[][] = [];
  private selectedRadio = -1;
  private isDisabled = false;
  private scopList:string[] = [];

  /**
   * The HelloWorldPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri, "intro");

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);

    //Set extensionUri to make it globally available
    this.extensionUri = extensionUri;

    //Set homedir to get relative path to the users home directory
    this.homedir = os.homedir();
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (HelloWorldPanel.currentPanel) {
      // If the webview panel already exists reveal it
      HelloWorldPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showHelloWorld",
        // Panel title
        "Palette Wizard",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [Uri.joinPath(extensionUri, "out")],
        }
      );

      HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    HelloWorldPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where *references* to CSS and JavaScript files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri, sendingStep: string) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const styleUri = getUri(webview, extensionUri, ["out", "style.css"]);
    const nonce = getNonce();

    let htmlString = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${styleUri}">
        <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        <title>Palette Wizard</title>
      </head>
    `;

    switch (sendingStep) {
      case "intro":
        htmlString = htmlString + getIntroPage();
        break;
      case "hello":
        htmlString = htmlString + getLoginPage();
        break;
      case "loading":
        htmlString = htmlString + getLoadingPage();
        break;
      case "login":
        htmlString =
          htmlString +
          getSettingsPage(
            this.projectList,
            this.clusterGroupList,
            this.clusterInfo,
            this.selectedRadio,
            this.isDisabled
          );
        break;
      case "create":
        htmlString = htmlString + getCreationPage();
        break;
      case "resize":
        htmlString = htmlString + getResizePage(this.clusterInfo[this.selectedRadio][0]);
        break;
      default:
        return "<body><h1>Internal Error</h1></body>";
    }

    htmlString =
      htmlString +
      `${
        this.error != ""
          ? `<vscode-divider role="separator"></vscode-divider><h3 class="rederr" readonly><p>${this.error}</p></h3></html>`
          : "</html>"
      }`;
    htmlString =
      htmlString +
      `${
        this.success != ""
          ? `<vscode-divider role="separator"></vscode-divider><h3 class="success" readonly><p>${this.success}</p></h3></html>`
          : "</html>"
      }`;
    return htmlString;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  //To be used if you want to handle message coming from the Webview (change data or update page).
  //This function calls _getWebviewWontnet function to change pages. If you want to change page programatically
  //without any input, just use getwebviewhtml directly
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        this.error = "";
        this.success = "";
        let clustObj;

        switch (command) {
          case "hello":
            //If the file with credentials already exists, skip the login page and send directly to settings page
            if (fs.existsSync(`${this.homedir}/.palette/pde/pde.yaml`)) {
              this.paletteFile = fs.readFileSync(`${this.homedir}/.palette/pde/pde.yaml`, "utf-8");
              this.pdeyaml = load(this.paletteFile) as any;
              //this.clusterGroupList = getClusterGrouplist();
              let proj = getProjectList();
              this.error = this.error + proj.error;
              this.projectList = proj.projectList;
              let clustGroup = getClusterGroupList();
              this.error = this.error + clustGroup.error;
              this.clusterGroupList = clustGroup.clusterGroupList;
              this.scopList = clustGroup.scopList;
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = clustObj.error as string;
              webview.html = this._getWebviewContent(
                this._panel.webview,
                this.extensionUri,
                "login"
              );
            } else {
              webview.html = this._getWebviewContent(
                this._panel.webview,
                this.extensionUri,
                "hello"
              );
            }
            break;
          case "login":
            const res: any = paletteLogin(message.data);
            this.error = res.error;
            if (res.status == "loginSuccess") {
              //Set palette file variable to the actual file after it is created after login
              this.paletteFile = fs.readFileSync(`${this.homedir}/.palette/pde/pde.yaml`, "utf-8");
              this.pdeyaml = load(this.paletteFile) as any;
              let proj = getProjectList();
              this.error = this.error + proj.error;
              this.projectList = proj.projectList;
              let clustGroup = getClusterGroupList();
              this.error = this.error + clustGroup.error;
              this.clusterGroupList = clustGroup.clusterGroupList;
              this.scopList = clustGroup.scopList;
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = clustObj.error as string;
              webview.html = this._getWebviewContent(
                this._panel.webview,
                this.extensionUri,
                "login"
              );
            } else {
              //Go back to the login page and show error
              webview.html = this._getWebviewContent(
                this._panel.webview,
                this.extensionUri,
                "hello"
              );
            }
            break;
          case "changeClusterGroup":
            this.error = switchConfig(message.data, "cluster-group") as string;
            clustObj = getClusterList();
            this.clusterInfo = clustObj.finalrow as string[][];
            this.error = clustObj.error as string;
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            break;
          case "changeProject":
            this.error = switchConfig(message.data, "project") as string;
            clustObj = getClusterList();
            this.clusterInfo = clustObj.finalrow as string[][];
            this.error = clustObj.error as string;
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            break;
          case "changeAPIKey":
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "hello");
            break;
          case "selectCluster":
            this.selectedRadio = message.data;
            if (this.clusterInfo[message.data][7] == "Running") {
              this.isDisabled = false;
            } else {
              this.isDisabled = true;
            }
            // clustObj= getClusterList();
            // this.clusterInfo =clustObj.finalrow as string[][];
            // this.error = clustObj.error as string;
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            break;
          case "downloadKube":
            let downObj = downloadKube(this.clusterInfo[message.data][0]);
            this.error = downObj.error as string;
            this.success = downObj.success;
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            if (downObj.status == 1) {
              var k8sExtension: any = vscode.extensions.getExtension(
                "ms-kubernetes-tools.vscode-kubernetes-tools"
              );
              if (k8sExtension.isActive == false) {
                k8sExtension.activate().then(
                  function () {
                    vscode.commands.executeCommand("extension.vsKubernetesUseKubeconfig");
                  },
                  function () {
                    console.log("Extension activation failed");
                  }
                );
              } else {
                vscode.commands.executeCommand("extension.vsKubernetesUseKubeconfig");
              }
            }
            break;
          case "noSelection":
            this.error = "Please select a virtual cluster to perform that action";
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            break;
          
          case "deleteCluster":
            vscode.window.showInformationMessage(`Do you really want to delete the Virtual Cluster ${this.clusterInfo[message.data][0]}`,"Yes","No").then((ans)=> {
              if(ans == "Yes"){
                let delObj = deleteCluster(this.clusterInfo[message.data][0]);
                this.error = delObj.error as string;
                this.success = delObj.success;
                webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
              } else {
                webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
              }
            });
            break;
          
          case "createCluster":
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "create");
            break;
          
          case "submitCreate":
            let createObj = createCluster(message.data,this.scopList[this.clusterGroupList.indexOf(this.pdeyaml.ClusterGroupName)]);
            this.error = this.error + createObj.error as any;
            this.success = this.success + createObj.success;
            if(createObj.status==1){
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = this.error + clustObj.error as string;
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            }else{
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "create");
            }
            break;
          
          case "back":
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            break;

          case "refresh":
            this.paletteFile = fs.readFileSync(`${this.homedir}/.palette/pde/pde.yaml`, "utf-8");
            this.pdeyaml = load(this.paletteFile) as any;
            let proj = getProjectList();
            this.error = this.error + proj.error;
            this.projectList = proj.projectList;
            let clustGroup = getClusterGroupList();
            this.error = this.error + clustGroup.error;
            this.clusterGroupList = clustGroup.clusterGroupList;
            this.scopList = clustGroup.scopList;
            clustObj = getClusterList();
            this.clusterInfo = clustObj.finalrow as string[][];
            this.error = clustObj.error as string;
            webview.html = this._getWebviewContent(
              this._panel.webview,
              this.extensionUri,
              "login"
            );
            break;
          
          case "resize":
            webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "resize");
            break;
          
          case "submitResize":
            let resizeObj = resizeCluster(message.data,this.clusterInfo[this.selectedRadio][0]);
            this.error = this.error + resizeObj.error as any;
            this.success = this.success + resizeObj.success;
            if(resizeObj.status==1){
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = this.error + clustObj.error as string;
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
            }else{
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "resize");
            }
            break;
          
            case "pauseCluster":
              let pauseObj = pauseCluster(this.clusterInfo[this.selectedRadio][0]);
              this.error = this.error + pauseObj.error;
              this.success = this.success + pauseObj.success;
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = this.error + clustObj.error as string;
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
              break;

            case "resumeCluster":
              let resumeObj = resumeCluster(this.clusterInfo[this.selectedRadio][0]);
              this.error = this.error + resumeObj.error;
              this.success = this.success + resumeObj.success;
              clustObj = getClusterList();
              this.clusterInfo = clustObj.finalrow as string[][];
              this.error = this.error + clustObj.error as string;
              webview.html = this._getWebviewContent(this._panel.webview, this.extensionUri, "login");
              break;
            

          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
        }
      },
      undefined,
      this._disposables
    );
  }
}
