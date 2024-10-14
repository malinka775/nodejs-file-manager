import { homedir } from "node:os";
import process from "node:process";
import {createInterface} from "node:readline/promises";

import { addFile, copyFileToDir, deleteFile, moveFile, printFile, renameFile } from "../fileOperations/index.js";
import { goUp, goToDir, printContents } from "../navigation/index.js";
import { getUserName } from "../helpers/getUserName.js";
import { getOSInfo } from "../os/index.js";
import { calcHash } from "../hash/index.js";
import { compress, decompress } from "../zip/index.js";
import { ErrorMessages } from "../consts/constants.js";
import { sayBye, greet, logCurrentDir } from "../output/index.js";

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

  try {
    if(command === '.exit') {
      rl.close()
      return
    }
    await cmdHandler[command](args.join(' '))
    logCurrentDir()
  } catch (e) {
    if (e.message === ErrorMessages.OPERATION_FAIL) {
      console.log(e.message)
    } else {
      console.log(ErrorMessages.INVALID_INPUT);
    }
  }
}); 

rl.on('close', () => {
  sayBye(USERNAME);
})
}

try {
  await start();
} catch (e) {
  console.log(e.message);
}
