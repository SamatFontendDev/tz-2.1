  
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const util = require('util');

const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];

const createFolder = util.promisify(fs.mkdir);
const copy = util.promisify(fs.link);
const checkDir = util.promisify(fs.access);

const readDir = async (base, level, summaryFolder) => {
    const files = fs.readdirSync(base);
    try {
        await checkDir('./dir');
    } catch(err) {
        createFolder('./dir');
    }
    
    files.forEach(async item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        let dirName = item[0];
        
     
        if (state.isDirectory()) {
            readDir(localBase, level + 1);
        } else {
            try{
                await createFolder(`./dir/${dirName}`);
                await copy(localBase, `./dir/${dirName}/${item}`);
            } catch(err) {
                await copy(localBase, `./dir/${dirName}/${item}`);
            }
        }
    });

}


readDir(baseArg, levaelArg, summaryFolderArg);
