export function getIntroPage() {
    return `
      <body>
          <h3>Welcome to the Palette Virtual Cluster Wizard!</h3>
          <p>To take the full advantage of all the features, make sure you have the following prerequisistes: </p> 
          <ol>
              <li>Palette CLI</li> 
              <li>Official VS Code Kubernetes Extension</li>
          </ol> 
          <div id="btn">
            <vscode-button id="intro">Next</vscode-button>
          </div>
      </body>
      `;
  }
  