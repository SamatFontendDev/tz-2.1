const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];
const removeSourceArg = process.argv[5];

function checkDir(path) {
    return new Promise((resolve, rejected) => {
        fs.access(path, err => {
            if (err) {
                resolve(path);
            }
            else {
                rejected(path);
            }
        });
    })
}

function createFolder(path) {
    return new Promise((resolve, rejected) => {
        fs.mkdir(path, err => {
            if (err) {
                rejected(err);
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
                rejected(err);
            } else {
                resolve(from);
            }
        })
    });
}

const readDir = (base, level, summaryFolder, removeSource) => {
    const files = fs.readdirSync(base);

    checkDir(`${summaryFolder}myDir`)
        .then((path) => {
            console.log(`${path} - не создана!`);
            return createFolder(path);
        })
        .then((path) => {
            console.log(`${path} - создана!`);
        })
        .catch((path) => {
            console.log(`${path} - была создана ранее!`);
        });

    files.forEach(item => {
        let localBase = path.join(base, item);

        let state = fs.statSync(localBase);
        let dirName = item[0];

        if (state.isDirectory()) {
            readDir(localBase, level + 1);
        } else {
            checkDir(`${summaryFolder}/myDir/${dirName}`)
                .then((path) => {
                    console.log(`Папки ${dirName} не обнаружено!`);
                    return createFolder(`${summaryFolder}/myDir/${dirName}`);
                })
                .then((path) => {
                    console.log(`Папка ${dirName} создана!`);
                    return copy(localBase, `${summaryFolder}/myDir/${dirName}/${item}`);
                })
                .then((from) => {
                    console.log(`${from} - скопирован!`);
                })
                .catch((path) => {
                    console.log(`${path} - создана ранее!`);
                    return copy(localBase, `${summaryFolder}/myDir/${dirName}/${item}`);
                })
                .then((from) => {
                    console.log(`${from} - скопирован`);
                })
        }
    });

    if (removeSource) {
        rimraf(base, (err) => {
          if (err) {
            console.error(95, err.message);
          } else {
            console.log('Исходня директория удалена!');
          }
        });
      }
}



readDir(baseArg, levaelArg, summaryFolderArg, removeSourceArg);