export function getLoginPage() {
    return `
      <body>
        <h3>Enter Your Palette Credentials</h3>
        <div>
            <form id="form">
                <p><vscode-text-field>Palette API Key</vscode-text-field></p>
                <p><vscode-text-field>Login URL</vscode-text-field></p>
            </form>
        </div>
        <div id="btn">
            <vscode-button id="login">Login</vscode-button>
        </div>
      </body>
      `;
  }
  