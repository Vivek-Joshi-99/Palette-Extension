import * as childProcess from "child_process";


//scope/nbeehive .... system/nvader .....org/nmollusk......system/n

export function getClusterGroupList() {
    let error = "";
    try {
        let out = childProcess.execSync(`palette pde cluster-group list`);
        let pStdout = out.toString();
        let flag=1;
        let clusterGroupList = pStdout.split(" ");
                let list = [];
                let scopList = [];
                for (let i = 0; i < clusterGroupList.length; i++) {
                  if(clusterGroupList[i].includes("\n") && i != clusterGroupList.length - 1 && flag==1){
                    flag=0;
                    list.push(clusterGroupList[i].split("\n")[1]);
                  }
                  else if (
                    clusterGroupList[i].includes("\n") &&
                    i != clusterGroupList.length - 1
                  ) {
                    list.push(clusterGroupList[i].split("\n")[1]);
                    scopList.push(clusterGroupList[i].split("\n")[0]);
                  } else if (
                    clusterGroupList[i].includes("\n") &&
                    i == clusterGroupList.length - 1
                  ) {
                    scopList.push(clusterGroupList[i].split("\n")[0]);
                  }

                }
        return {error:error, clusterGroupList:list,scopList:scopList};
    }
    catch(error){
        return {error:error, clusterGroupList: [],scopList:[]};
    }
    
  }