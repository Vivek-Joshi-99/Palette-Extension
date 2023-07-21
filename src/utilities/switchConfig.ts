import * as childProcess from "child_process";

export function switchConfig(data:string,option:string) {
    let error = "";
    try {
        childProcess.execSync(`palette pde ${option} switch --name ${data}`);
        return error;
    }
    catch(error){
        return error;
    }
}