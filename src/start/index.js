import { homedir } from "node:os";
import process from "node:process";
import util from "node:util";

import { ErrorMessages, CLI_Args } from "../consts/constants.js";

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

const start = () => {
  USERNAME = getUserName(CLI_Args.USERNAME);
  greet(USERNAME);
  process.chdir(HOMEDIR)
  logCurrentDir();
}

try {
  start();

  sayBye(USERNAME);
} catch (e) {
  console.log(e.message);
  // throw new Error(e.message);
}
