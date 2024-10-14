import { ErrorMessages } from "../consts/constants.js";
import util from 'node:util';

export const getUserName = () => {
  const USERNAME_ARG ='--username';
  try {
    const {positionals: args} = util.parseArgs({allowPositionals: true});
    console.log('from getUser', args);
    const userNameArg = args
      .find((el) => el.startsWith(USERNAME_ARG))
    if (!userNameArg) throw new Error();

    return userNameArg.slice(USERNAME_ARG.length + 1);
  } catch (e) {
    throw new Error(ErrorMessages.INVALID_INPUT)
  }
};
