import * as childProcess from "child_process";
import { load } from "js-yaml";
import * as fs from "fs";
import * as os from "os";

export function createCluster(data:any,scope:string) {
    let error = "";
    try {
        let homedir = os.homedir();
        let paletteFile = fs.readFileSync(
        `${homedir}/.palette/pde/pde.yaml`,
        "utf-8"
        );
        let pdeyaml = load(paletteFile) as any;
        let cpu = data[1];
        let name = data[0];
        let storage = data[3];
        let memory = data[2];
        let out = childProcess.execSync(`palette pde virtual-cluster create --cpu ${cpu} --memory ${memory} --name ${name} --storage ${storage} --cluster-group-name ${pdeyaml.ClusterGroupName} --cluster-group-scope ${scope}`);
        let pStdout = out.toString();
        
        return {error:error, success:pStdout,status:1};
    }
    catch(error){
        return {error:error, success:"",status:0};
    }
    
  }