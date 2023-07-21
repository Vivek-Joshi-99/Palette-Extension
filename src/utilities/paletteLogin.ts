import * as childProcess from "child_process";

export function paletteLogin(data: Array<string>) {
    let error = "";
    try {
        childProcess.execSync(`palette pde login --api-key ${data[0]} --console-url ${data[1]} --project Default`);
        return {error:error, status:"loginSuccess"};
    }
    catch(error){
        return {error:error, status:"loginFailed"};
    }
    
    //   (err, stdout, stderr) => {
    //     if (err) {
    //         console.log("Here");
    //       error = error + err;
    //       return {error:error, status:"loginFailed"};
    //     } 
    //     else if (stderr){
    //         console.log("Here 2");
    //         error = error + stderr;
    //         return {error:error, status:"loginFailed"};
    //     } 
    //     else{
    //         console.log("Here 3");
    //         console.log(err,stderr);
    //         return {error:error, status:"loginSuccess"};
    //     }
    //   }
  }