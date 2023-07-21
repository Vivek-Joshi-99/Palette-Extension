import * as childProcess from "child_process";

export function getClusterList() {
    let error = "";
    try {
        let out = childProcess.execSync(`palette pde virtual-cluster list`);
        let clusterDetails = out.toString();
        let clusterArray = clusterDetails.split("\n") as string[];
        let finalrow:string[][] = [];
        let row:string[] = [];
        for(let i = 0;i < clusterArray.length;i++)
                {
                  let rowArray = clusterArray[i].split(" ");
                  row = [];
                  for(let j= 0;j<rowArray.length;j++){
                    if(rowArray[j]!='' && rowArray[j]!=' '){
                      row.push(rowArray[j]);
                    }
                  }
                  finalrow.push(row);
                }
        return {error:error,finalrow:finalrow};
    }
    catch(error){
        return {error:error,finalrow:[]};
    }
    
  }