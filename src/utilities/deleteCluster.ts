import * as childProcess from "child_process";

export function deleteCluster(data:string) {
    let error = "";
    let success = "";
    try {
        let out = childProcess.execSync(`palette pde virtual-cluster delete --name  ${data}`);
        success = out.toString();
        return {error:error, success:success};
    }
    catch(error){
        return {error:error, success:success};
    }
    
  }