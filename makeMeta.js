


//https://medium.com/meshstudio/continuous-integration-with-circleci-and-nodejs-44c3cf0074a0
//requiring path and fs modules
const path = require("path");
const promisify = require("promisify-node");
const axios = require('axios');
const fs = promisify("fs");
const chalk = require('chalk')
const { exec, spawn, fork, execFile } = require("promisify-child-process");

const simpleGit = require("simple-git")();
// Shelljs package for running shell tasks optional
const shellJs = require("shelljs");
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require("simple-git/promise")();


const prompt = require('prompt-sync')();
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
require("dotenv").config();

// sequentially
const asyncFilter = async (arr, predicate) =>
  arr.reduce(
    async (memo, e) => [...(await memo), ...((await predicate(e)) ? [e] : [])],
    []
  );

async function exec_it() {
  try {
        const { stdout, stderr } = await exec("npm run build");
        
        
        const directoryPath = path.join(__dirname, "dist");

        let files = await fs.readdir(directoryPath);
        let hash = "";
        files = files.filter(function (file) {
            const stat = fs.statSync(directoryPath + "/" + file);

            if (stat.isDirectory()) {
                hash = file;
                return false;
            }
            return true;
        });

        asyncForEach(files, async function (file) {
            await fs.rename(
                path.join(directoryPath, file),
                path.join(directoryPath, hash, file)
            );
        });

        await fs.writeFile(`${directoryPath}/meta.txt`, hash);
    shellJs.cd(__dirname);
    const repo = process.env.GIT_REPO;
    // User name and password of your GitHub
    const userName = process.env.GIT_USER_NAME;
    const password = process.env.GIT_USER_PASSWORD;
    const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
    // add local git config like username and email

    simpleGit.addConfig("user.email", process.env.GIT_USER_EMAIL);
    simpleGit.addConfig("user.name", userName);
    
    await simpleGitPromise.add(".");
    const message = prompt('Enter commit message:');
    console.log(message)
    await simpleGitPromise.raw(['commit', '-m', message])
    await simpleGitPromise.push("origin", "master");

    // ~
    
  } catch (e) {
    throw e;
  }
}
exec_it();



