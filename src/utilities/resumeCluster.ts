import * as childProcess from "child_process";

export function resumeCluster(name:string) {
    let error = "";
    try {
        let out = childProcess.execSync(`palette pde virtual-cluster lifecycle --name  ${name} --action resume`);
        let pStdout = out.toString();
        
        return {error:error, success:pStdout};
    }
    catch(error){
        return {error:error, success:""};
    }
  }