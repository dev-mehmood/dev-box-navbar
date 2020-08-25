//requiring path and fs modules
const path = require('path');
const promisify = require('promisify-node')
const fs = promisify('fs');
const { exec, spawn, fork, execFile } = require('promisify-child-process');
const fileName = 'navbar.js'
async function exec_it() {

    try {
        const { stdout, stderr } = await exec('npm run build');

        const directoryPath = path.join(__dirname, 'dist');

        const files = await fs.readdir(directoryPath);

        file = files.filter((f)=>f.endsWith(fileName))
        if(file.length) {
            hash = file[0].split('-')[0]
            await fs.writeFile(`${directoryPath}/meta.txt`, hash)
            console.log(file)
        }
       
    } catch (e) {
        throw (e)
    }

}
exec_it()
