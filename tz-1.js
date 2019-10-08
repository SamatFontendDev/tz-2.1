const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];
const removeSourceArg = process.argv[5];


const readDir = (base, level, summaryFolder, removeSource) => {
  const files = fs.readdirSync(base);
  fs.access(`${summaryFolder}/myDir`, err => {
    if (err) {
      fs.mkdir(`${summaryFolder}/myDir`, () => {
        console.log('myDir created!');
      });
    }
  });
  
  files.forEach(item => {
    let localBase = path.join(base, item);
    
    let state = fs.statSync(localBase);
    let dirName = item[0];
    if (state.isDirectory()) {
      readDir(localBase, level + 1);
    } else {
      fs.access(`${summaryFolder}/myDir/${dirName}`, (err) => {
        if (err) {
          fs.mkdir(`${summaryFolder}/myDir/${dirName}`, () => {
            
            fs.link(localBase, `${summaryFolder}/myDir/${dirName}/${item}`, err => {
              if (err) {
                console.log(`${summaryFolder}/myDir/${dirName}/${item}`);
                console.error(24,err.message);
              }
            });
          });

         } else {
          fs.link(localBase, `${summaryFolder}/myDir/${dirName}/${item}`, err => {
            if (err) {
              console.error(33,err.message);
            }
          });
        }
      });
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

readDir(baseArg, levaelArg, removeSourceArg, summaryFolderArg);