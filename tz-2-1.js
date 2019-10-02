const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const baseArg = process.argv[2];
const levaelArg = process.argv[3];
const summaryFolderArg = process.argv[4];
const removeSourceArg = process.argv[5];

const readDir = (base, level, removeSource, summaryFolder) => {
    const files = fs.readdirSync(base);
    
    function createDir() {
        return new Promise((resolve, rejected) => {
            
        })
    }

    function checkDir() {
        return new Promise((resolve, rejected) => {
            
        })
    }
}