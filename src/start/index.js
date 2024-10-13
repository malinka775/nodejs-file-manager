import { homedir } from "node:os";
import process from "node:process";
import util from "node:util";
import {createInterface} from 'node:readline/promises';

import { ErrorMessages, CLI_Args } from "../consts/constants.js";
import { goUp, goToDir, printContents } from "../navigation/index.js";
import { addFile, copyFileToDir, deleteFile, moveFile, printFile, renameFile } from "../fileOperations/index.js";

const getUserName = (targetArg) => {

  try {
    const {positionals: args} = util.parseArgs({allowPositionals: true});

    const userNameArg = args
      .find((el) => el.startsWith(targetArg))
    if (!userNameArg) throw new Error();

    return userNameArg.slice(targetArg.length + 1);
  } catch (e) {
    throw new Error(ErrorMessages.INVALID_INPUT)
  }
};

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
}

const start = async() => {
  USERNAME = getUserName(CLI_Args.USERNAME);
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
