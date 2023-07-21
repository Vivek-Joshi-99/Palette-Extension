import * as childProcess from "child_process";
import * as fs from "fs";

export function downloadKube(data:string) {
    let error = "";
    let success = "";
    let status = 0;
    try {
        let out = childProcess.execSync(`palette pde virtual-cluster download-kubeconfig --name ${data}`);
        let pStdout = out.toString();
        let kcPath = " ";
          let newStr = [];
          kcPath = pStdout.split(" ").at(-1) as string;
          for (let i = 0; i < kcPath.length - 1; i++) {
            newStr.push(kcPath[i]);
          }
          kcPath = newStr.map((item) => item).join("");
          
          const kc = fs.readFileSync(`${kcPath}`, "utf-8");
          
          if (kc.length == 0) {
            success =
              "The cluster is still provisioning. Please try again later.";
          } else {
            success = pStdout;
            status = 1;
          }
        return {error:error,success:success,status:status};
    }
    catch(error){
        return {error:error,success:success,status:status};
    }
    
  }