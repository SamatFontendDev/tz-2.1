const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const util = require('util');


const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];
const removeSourceArg = process.argv[5];

// const checkDir = util.promisify(fs.stat);
function checkDir (path) {
    return new Promise ((resolve, rejected) => {
        fs.stat(path, function(err, stat) {
            if(err == null) {
                resolve(path);
            } else if(err.code == 'ENOENT') {
                rejected(err);
            } 
        });
    });
}
const createFolder = util.promisify(fs.mkdir);
const copy = util.promisify(fs.link);

const readDir = async (base, level, summaryFolder, removeSource) => {
    const files = fs.readdirSync(base);
    
    
    files.forEach(async item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        let dirName = item[0];
        
     
        if (state.isDirectory()) {
            readDir(localBase, level + 1);
        } else {
            try{
                await createFolder(`${summaryFolder}/${dirName}`);
                await copy(localBase, `${summaryFolder}/${dirName}/${item}`);
            } catch(err) {
                await copy(localBase, `${summaryFolder}/${dirName}/${item}`);
            }
        }
    });

}
// (async function(){
//     try{
//         // await checkDir(`${summaryFolder}/myDir`);
//       const checkDir2 = await checkDir(`/myDir`);
//       console.log(58,checkDir2);
     
//     } catch(err) {
      
//       await createFolder(`./myDir`);
//     }
// })()


readDir(baseArg, levaelArg, summaryFolderArg, removeSourceArg);

// if (removeSource) {
//     rimraf(base, (err) => {
//       if (err) {
//         console.error(50, err.message);
//       } else {
//         console.log('source directory deleted!');
//       }
//     });
// }
