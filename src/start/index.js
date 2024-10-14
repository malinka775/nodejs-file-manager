import { homedir } from "node:os";
import process from "node:process";
import util from "node:util";
import {createInterface} from 'node:readline/promises';

import { ErrorMessages, CLI_Args } from "../consts/constants.js";
import { getUserName } from "../helpers/getUserName.js";
import { goUp, goToDir, printContents } from "../navigation/index.js";
import { addFile, copyFileToDir, deleteFile, moveFile, printFile, renameFile } from "../fileOperations/index.js";
import { getOSInfo } from "../os/index.js";
import { calcHash } from "../hash/index.js";
import { compress, decompress } from "../zip/index.js";

const greet = (username) => {
  console.log(`Welcome to the File Manager, ${username}!`);
};

const sayBye = (username) => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
};

const logCurrentDir = () => {
  console.log("You are currently in", process.cwd());
};

let USERNAME
const HOMEDIR = homedir();

// HANDLING COMMANDS
const cmdHandler = {
  up: goUp,
  cd: goToDir,
  ls: printContents,
  cat: printFile,
  add: addFile,
  rn: renameFile,
  cp: copyFileToDir,
  mv: moveFile,
  rm: deleteFile,
  os: getOSInfo,
  hash: calcHash,
  compress,
  decompress,
}

const start = async() => {
  USERNAME = getUserName();
  greet(USERNAME);
  process.chdir(HOMEDIR)
  logCurrentDir();

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', async (input) => {
  const args = input.trim().split(' ')
  const command = args.shift();

  try{
    await cmdHandler[command](args.join(' '))
    logCurrentDir()
  } catch (e) {
    console.log(e.message); 
  }
}); 
}

try {
  await start();

  sayBye(USERNAME);
} catch (e) {
  console.log(e.message);
}
