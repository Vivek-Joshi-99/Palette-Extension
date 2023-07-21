import * as childProcess from "child_process";

export function getProjectList() {
    let error = "";
    try {
        let out = childProcess.execSync(`palette pde project list`);
        let pStdout = out.toString();
        let projectList = pStdout.split(" ");
          let list = [];
          for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].includes("\n") && i != projectList.length - 1) {
              list.push(projectList[i].split("\n")[1]);
            }
          }
        return {error:error, projectList:list};
    }
    catch(error){
        return {error:error, projectList: []};
    }
    
  }