import os from 'node:os';
import { getUserName } from '../helpers/getUserName.js';
import { ErrorMessages } from '../consts/constants.js';

const printCpus = () => {
  const cpus = os.cpus();

  console.log('You have', cpus.length, 'CPU')
  cpus.forEach((item, index) => {
    const clockRate = (item.speed / 1000).toFixed(1);
    console.log(`CPU ${index + 1} info: model - ${item.model}, clock rate: clockRate - ${clockRate} GHz`)
  })
}

const OS_FUNCTIONS = {
  '--EOL': () => console.log(JSON.stringify(os.EOL)),
  '--cpus': () => printCpus(),
  '--homedir': () => console.log(os.homedir()),
  '--username': () => console.log(getUserName()),
  '--architecture': () => console.log(os.arch()),
}

const getOSInfo =  (param) => {
  if(OS_FUNCTIONS[param]) {
    OS_FUNCTIONS[param]()
  } else {
    throw new Error(ErrorMessages.INVALID_INPUT);
  }
}

export {getOSInfo};
