import { readdir } from 'node:fs/promises';
import {join} from 'node:path';
import { EntityTypes, ErrorMessages } from '../consts/constants.js';

const goUp = () => {
  process.chdir('..');
  console.log('You are currently in', process.cwd());
}

const goToDir = (dirname) => {
  process.chdir(dirname);
}

const printContents = async () => {
  const currentDir = process.cwd();
  try {
    const entities = await readdir(currentDir, {withFileTypes: true});
    const content = entities.map(item => {
      return {
        Name: item.name,
        Type: item.isDirectory() ? EntityTypes.DIRECTORY : EntityTypes.FILE,
      }
    }).sort((a, b) => a.Name.localeCompare(b.Name)).sort((a,b) => {
      if (a.Type !== b.Type) {
        return a.Type === EntityTypes.DIRECTORY ? -1 : 1
      }
    })
    console.table(content);
  } catch(e) {
    throw new Error(ErrorMessages.OPERATION_FAIL);
  }
}

await printContents();
