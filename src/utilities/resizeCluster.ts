import * as childProcess from "child_process";

export function resizeCluster(data:any,name:string) {
    let error = "";
    try {
        let cpu = data[0];
        let storage = data[2];
        let memory = data[1];
        let out = childProcess.execSync(`palette pde virtual-cluster resize --cpu ${cpu} --name ${name} --memory ${memory} --storage ${storage}`);
        let pStdout = out.toString();
        
        return {error:error, success:pStdout,status:1};
    }
    catch(error){
        return {error:error, success:"",status:0};
    }
    
  }