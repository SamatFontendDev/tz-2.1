const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {promisify} = require('util');

const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];
const removeSourceArg = process.argv[5];

function checkDir(path) {
    return new Promise((resolve, rejected) => {
        fs.stat(path, err => {
            if (!err) {
                rejected(err.message);
            } else if (err.code === 'ENOENT') {
               resolve(path);
            }
        });
    }); 
};


function createFolder(path) {
    return new Promise((resolve, rejected) => {
        fs.mkdir(path, err => {
            if (err) {
                rejected(err.message);
            } else {
                resolve(path);
            }
        })
    })
}

function copy(from, to) {
    return new Promise((resolve, rejected) => {
        fs.link(from, to, err => {
            if (err) {
                rejected(err.message);
            } else {
                resolve(from);
            }
        })
    });
}


const readDir = async (base, level, summaryFolder, removeSource) => {
    const files = fs.readdirSync(base);
    await checkDir(`${summaryFolder}/myDir`);
    await createFolder(`${summaryFolder}/myDir`);

    
    files.forEach(async item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        let dirName = item[0];
        
        
        if (state.isDirectory()) {
            readDir(localBase, level + 1);
        } else {
            try{
                await checkDir(`${summaryFolder}myDir/${dirName}`);
                await createFolder(`${summaryFolder}myDir/${dirName}`);
                await copy(localBase, `${summaryFolder}myDir/${dirName}/${item}`);
            } catch {
                await copy(localBase, `${summaryFolder}myDir/${dirName}/${item}`);
            }
        }
    });

    if (removeSource) {
        rimraf(base, (err) => {
          if (err) {
            console.error(50, err.message);
          } else {
            console.log('source directory deleted!');
          }
        });
    }
}



readDir(baseArg, levaelArg, summaryFolderArg, removeSourceArg);